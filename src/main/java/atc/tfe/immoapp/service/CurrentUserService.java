package atc.tfe.immoapp.service;

import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


/**
 * Service utilitaire pour récupérer l'utilisateur courant (authentifié) à partir du SecurityContext.
 * <p>
 * Il expose :
 * {@link #getCurrentEmail()} : retourne l'email (principal) de l'utilisateur authentifié, ou {@code null} si anonyme.
 * {@link #getCurrentUser()} : charge depuis la base l'entité {@link User} correspondant à l'email courant, ou {@code null} si absent/non authentifié.
 */
@Service
@RequiredArgsConstructor
public class CurrentUserService {
    private final UserRepository userRepository;

    /**
     * Récupère l'email de l'utilisateur actuellement authentifié depuis le {@link SecurityContextHolder}.
     * @return l'email (valeur de {@code Authentication#getPrincipal()}) ou {@code null} si non authentifié
     */
    public String getCurrentEmail(){
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? String.valueOf(auth.getPrincipal()) : null;
    }

    /**
     * Récupère l'entité {@link User} correspondant à l'utilisateur courant.
     * <p>
     * Étapes :
     * Lire l'email courant via {@link #getCurrentEmail()} ;
     * Si non nul, interroger le {@link UserRepository} ;
     * Retourner l'entité trouvée, ou {@code null} sinon.
     * @return l'utilisateur courant, ou {@code null} si non authentifié ou inconnu en base
     */
    public User getCurrentUser(){
        String email = getCurrentEmail();
        if (email == null) return null;
        return userRepository.findByEmail(email);
    }
}
