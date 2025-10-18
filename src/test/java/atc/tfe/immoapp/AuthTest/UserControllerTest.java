package atc.tfe.immoapp.AuthTest;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.enums.UserStatus;
import atc.tfe.immoapp.enums.UserType;
import atc.tfe.immoapp.repository.UserRepository;
import atc.tfe.immoapp.utils.JwtUtil;
import atc.tfe.immoapp.web.UserController;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = UserController.class)
class UserControllerTest {
    public static final String OWNER_TEST_EMAIL = "ownerTest@immoapp.local";
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private PasswordEncoder passwordEncoder;
    @MockitoBean
    JwtUtil jwtUtil;

    private User currentUser(String email) {
        User user = new User();
        user.setId(7L);
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

    @BeforeEach
    void setAuth() {
        var auth = new UsernamePasswordAuthenticationToken(OWNER_TEST_EMAIL, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void clearAuth() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getUser_ok_returnsDtoWithoutPassword() throws Exception {
        var user = currentUser(OWNER_TEST_EMAIL);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        mockMvc.perform(get("/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(OWNER_TEST_EMAIL))
                .andExpect(jsonPath("$.lastname").value("Doe"))
                .andExpect(jsonPath("$.firstname").value("John"))
                .andExpect(jsonPath("$.phone").value("0477111111"))
                .andExpect(jsonPath("$.userType").value("OWNER"));
    }

    @Test
    void modifyUser_ok_updatesProfile_andReturnsDto() throws Exception {
        var user = currentUser(OWNER_TEST_EMAIL);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        var body = objectMapper.writeValueAsString(Map.of(
                "lastname", "Durand", "firstname", "Jean", "phone", "0477111122"
        ));

        mockMvc.perform(post("/user").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastname").value("Durand"))
                .andExpect(jsonPath("$.firstname").value("Jean"))
                .andExpect(jsonPath("$.phone").value("0477111122"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getLastname()).isEqualTo("Durand");
        assertThat(captor.getValue().getFirstname()).isEqualTo("Jean");
        assertThat(captor.getValue().getPhone()).isEqualTo("0477111122");
    }

    @Test
    void modifyUserPassword_ko_mismatch_400() throws Exception {
        var user = currentUser(OWNER_TEST_EMAIL);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        var body  = objectMapper.writeValueAsString(Map.of(
                "newPassword", "test123", "validatePassword", "differentPassword"
        ));

        mockMvc.perform(post("/user/password").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void modifyUserPassword_ok_updatesHash() throws Exception {
        var user = currentUser(OWNER_TEST_EMAIL);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
        String newPwd = "test123";
        when(passwordEncoder.encode(newPwd)).thenReturn("$2a$12$/rsahQGXDhztLxQCzwacnetW4CkfvbhIzcm7MbKrQ9CoO/k1Jpj.S");

        var body = objectMapper.writeValueAsString(Map.of(
                "newPassword", newPwd, "validateNewPassword", newPwd
        ));

        mockMvc.perform(post("/user/password").contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The password has been modified"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getPasswordHash())
                .isEqualTo("$2a$12$/rsahQGXDhztLxQCzwacnetW4CkfvbhIzcm7MbKrQ9CoO/k1Jpj.S");
    }
}
