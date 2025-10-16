package atc.tfe.immoapp.web;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.dto.mapper.AuthRequestDTO;
import atc.tfe.immoapp.dto.mapper.AuthResponseDTO;
import atc.tfe.immoapp.dto.mapper.SignupDTO;
import atc.tfe.immoapp.enums.UserStatus;
import atc.tfe.immoapp.repository.UserRepository;
import atc.tfe.immoapp.utils.JwtUtil;
import jakarta.validation.Valid;

import java.time.Instant;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
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
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequestDTO request) {
        User user = userRepository.findByEmail(request.email());
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUserType().name(), user.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupDTO request) {
        User existingUser = userRepository.findByEmail(request.email());
        if (existingUser != null) {
            return ResponseEntity.status(500).body("L'email est déjà réservé à un autre user.");
        }

        //String hashedPassword = new BCryptPasswordEncoder().encode(request.password());

        User newUser = new User();
        newUser.setEmail(request.email());
        newUser.setPasswordHash(passwordEncoder.encode(request.password()));
        newUser.setLastname(request.lastname());
        newUser.setFirstname(request.firstname());
        newUser.setPhone(request.phone());
        newUser.setUserType(request.userType());
        newUser.setCreatedAt(Instant.now());
        newUser.setUpdatedAt(Instant.now());
        newUser.setStatus(UserStatus.ACTIVE);
        userRepository.save(newUser);

        User user = userRepository.findByEmail(request.email());

        String token = jwtUtil.generateToken(user.getId(), user.getUserType().name(), user.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    /*@GetMapping("/me")
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
    }*/
}
