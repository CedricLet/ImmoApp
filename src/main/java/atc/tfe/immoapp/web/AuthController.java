package atc.tfe.immoapp.web;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.dto.mapper.AuthRequestDTO;
import atc.tfe.immoapp.dto.mapper.AuthResponseDTO;
import atc.tfe.immoapp.repository.UserRepository;
import atc.tfe.immoapp.utils.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = encoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request) {
        User user = userRepository.findByEmail(request.email());
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUserType().name(), user.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal Object principal) {
        if (principal == null) return ResponseEntity.status(401).build();

        String email = principal.toString(); // car on a injecté l'email comme principal
        User u = userRepository.findByEmail(email);
        if (u == null) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

        return ResponseEntity.ok(Map.of(
                "email", u.getEmail(),
                "firstname", u.getFirstname(),
                "lastname", u.getLastname(),
                "role", u.getUserType().name()
        ));
    }
}
