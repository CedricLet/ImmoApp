package atc.tfe.immoapp.AuthTest;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.enums.UserStatus;
import atc.tfe.immoapp.enums.UserType;
import atc.tfe.immoapp.repository.UserRepository;
import atc.tfe.immoapp.utils.JwtUtil;
import atc.tfe.immoapp.web.AuthController;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import java.time.Instant;
import java.util.Map;

import static org.mockito.Mockito.when;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(AuthController.class)
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private JwtUtil jwtUtil;
    @MockitoBean
    private PasswordEncoder passwordEncoder;

    private User newUser(String email) {
        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        user.setPasswordHash("$2a$12$/rsahQGXDhztLxQCzwacnetW4CkfvbhIzcm7MbKrQ9CoO/k1Jpj.S"); // test123
        user.setLastname("Doe");
        user.setFirstname("John");
        user.setPhone("0477111111");
        user.setUserType(UserType.OWNER);
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        return user;
    }

    @Test
    void login_ok_returnsToken() throws Exception {
        String email = "ownerTest@immoapp.local";
        User u = newUser(email);
        when(userRepository.findByEmail(email)).thenReturn(u);
        when(passwordEncoder.matches("test123", u.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateToken(1L, u.getUserType().name(), email)).thenReturn("token");

        var body = objectMapper.writeValueAsString(Map.of("email", email, "password", "test123"));

        mockMvc.perform(post("/login").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"));
    }

    @Test
    void login_ko_badCredentials_401() throws Exception {
        String email = "ownerUnkown@immoapp.local";
        when(userRepository.findByEmail(email)).thenReturn(null);

        var body = objectMapper.writeValueAsString(Map.of("email", email, "password", "bad"));

        mockMvc.perform(post("/login").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signup_conflict_409_whenEmailAlreadyUsed() throws Exception {
        String email = "exists@immoapp.local";
        when(userRepository.findByEmail(email)).thenReturn(newUser(email));

        var body = objectMapper.writeValueAsString(Map.of("email", email, "password", "test123",
                "lastname", "Doe",  "firstname", "John",
                "phone", "0477111111",  "userType", "OWNER"));

        mockMvc.perform(post("/signup").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void signup_created_201_returnsToken() throws Exception {
        String email = "new@immoapp.local";
        when(userRepository.findByEmail(email)).thenReturn(null);
        when(passwordEncoder.encode("test123")).thenReturn("$2a$12$/rsahQGXDhztLxQCzwacnetW4CkfvbhIzcm7MbKrQ9CoO/k1Jpj.S");
        when(jwtUtil.generateToken(anyLong(), anyString(), eq(email))).thenReturn("token");
        when(userRepository.save(ArgumentMatchers.any(User.class)))
                .thenAnswer(i -> {
                    User save = i.getArgument(0);
                    save.setId(42L);
                    return save;
                });

        var body = objectMapper.writeValueAsString(Map.of("email", email, "password", "test123",
                "lastname", "Doe", "firstname", "Jhon",
                "phone", "0477111111",  "userType", "OWNER"));

        mockMvc.perform(post("/signup").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("token"));
    }
}
