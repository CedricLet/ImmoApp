package atc.tfe.immoapp.web;

import atc.tfe.immoapp.dto.mapper.UserDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.dto.mapper.ModifyUserDTO;
import atc.tfe.immoapp.dto.mapper.ModifyUserPasswordDTO;
import atc.tfe.immoapp.repository.UserRepository;
import jakarta.validation.Valid;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository,  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return getUserDTOResponseEntity(user);
    }

    @PostMapping("/user")
    public ResponseEntity<?> modifyUser(@Valid @RequestBody ModifyUserDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        user.setLastname(request.lastname());
        user.setFirstname(request.firstname());
        user.setPhone(request.phone());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        return getUserDTOResponseEntity(user);
    }

    private static ResponseEntity<UserDTO> getUserDTOResponseEntity(User user) {
        UserDTO userDTO = new UserDTO(user.getLastname(), user.getFirstname(), user.getEmail(), user.getPhone(), user.getUserType());
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/user/password")
    public ResponseEntity<?> modifyUserPassword(@Valid @RequestBody ModifyUserPasswordDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (!request.newPassword().equals(request.validateNewPassword())) {
            return ResponseEntity.status(400).body("The two passwords are not the same");
        }

        //String hashedPassword = new BCryptPasswordEncoder().encode(request.newPassword());
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "The password has been modified"));
    }
}
