package atc.tfe.immoapp.security;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.enums.UserStatus;
import atc.tfe.immoapp.enums.UserType;
import atc.tfe.immoapp.repository.UserRepository;
import atc.tfe.immoapp.utils.JwtUtil;
import atc.tfe.immoapp.web.AuthController;
import atc.tfe.immoapp.web.UserController;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {UserController.class, AuthController.class})
@AutoConfigureMockMvc
@Import({SecurityIntegrationTest.TestSecurityConfig.class})
class SecurityIntegrationTest {
    private static final String EMAIL = "ownerTest@immoapp.local";
    private static final String BEARER = "Bearer faketoken";

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        SecurityFilterChain testChain(HttpSecurity http) throws Exception {
            http.csrf(AbstractHttpConfigurer::disable);
            http.authorizeHttpRequests(reg -> reg.anyRequest().authenticated());
            http.addFilterBefore(new TestJwtOkFilter(), UsernamePasswordAuthenticationFilter.class);
            return http.build();
        }
    }

    static class TestJwtOkFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
            String auth = req.getHeader("Authorization");
            if (auth != null && auth.startsWith("Bearer ")) {
                var authToken = new UsernamePasswordAuthenticationToken("ownerTest@immoapp.local", null, List.of(new SimpleGrantedAuthority("ROLE_OWNER")));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            chain.doFilter(req, res);
        }
    }

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtUtil jwtUtil;

    @BeforeEach
    void setup() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(stubUser());
    }

    private User stubUser() {
        User u = new User();
        u.setId(7L);
        u.setEmail(EMAIL);
        u.setPasswordHash("$2a$12$/rsahQGXDhztLxQCzwacnetW4CkfvbhIzcm7MbKrQ9CoO/k1Jpj.S"); // "test123"
        u.setLastname("Doe");
        u.setFirstname("John");
        u.setPhone("0477111111");
        u.setUserType(UserType.OWNER);
        u.setStatus(UserStatus.ACTIVE);
        return u;
    }

    @Test
    void secured_endpoint_with_valid_token_returns_200() throws Exception {
        mockMvc.perform(get("/user")
                        .header("Authorization", BEARER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(EMAIL));
    }

    @Test
    void login_or_password_change_needs_csrf_and_token() throws Exception {
        // Exemple si tu appelles un POST protégé par CSRF (selon ta SecurityConfig)
        var body = objectMapper.writeValueAsString(
                java.util.Map.of("newPassword", "test123", "validateNewPassword", "test123")
        );

        mockMvc.perform(post("/user/password")
                        .header("Authorization", BEARER)
                        .with(csrf()) // important si CSRF activé sur POST
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }
}
