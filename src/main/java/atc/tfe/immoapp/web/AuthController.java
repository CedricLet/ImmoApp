package atc.tfe.immoapp.web;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.dto.mapper.AuthRequestDTO;
import atc.tfe.immoapp.dto.mapper.AuthResponseDTO;
import atc.tfe.immoapp.repository.UserRepository;
import atc.tfe.immoapp.utils.JwtUtil;
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
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request) {
        User user = userRepository.findByEmail(request.email());
        if (user == null || !new BCryptPasswordEncoder().matches(request.password(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUserType().name(), user.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }
}
