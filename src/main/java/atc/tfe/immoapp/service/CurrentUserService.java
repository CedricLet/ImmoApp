package atc.tfe.immoapp.service;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {
    private final UserRepository userRepository;

    public String getCurrentEmail(){
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? String.valueOf(auth.getPrincipal()) : null;
    }

    public User getCurrentUser(){
        String email = getCurrentEmail();
        if (email == null) return null;
        return userRepository.findByEmail(email);
    }
}
