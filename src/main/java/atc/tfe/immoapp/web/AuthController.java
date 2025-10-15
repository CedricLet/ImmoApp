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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequestDTO request) {
        User user = userRepository.findByEmail(request.email());
        if (user == null || !new BCryptPasswordEncoder().matches(request.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
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

        String hashedPassword = new BCryptPasswordEncoder().encode(request.password());

        User newUser = new User();
        newUser.setEmail(request.email());
        newUser.setPasswordHash(hashedPassword);
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
}
