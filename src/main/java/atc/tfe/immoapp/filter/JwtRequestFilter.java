package atc.tfe.immoapp.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import atc.tfe.immoapp.utils.JwtUtil;

import java.io.IOException;
import java.util.List;

/**
 * Filtre Spring Security exécuté une seule fois par requête pour gérer l’authentification par JWT.
 * Rôle :
 * Lire l’en-tête {@code Authorization} (schéma "Bearer").
 * Extraire le token, puis en dériver les informations (email et rôle) via {@link JwtUtil}.
 * Valider le token (signature, expiration, audience, etc. selon {@link JwtUtil}).
 * Si valide, construire une {@link UsernamePasswordAuthenticationToken} et
 * la placer dans le {@link SecurityContextHolder} pour marquer la requête
 * comme authentifiée avec l’autorité extraite.
 * <p>
 * Notes
 * Si aucun token valide n’est présent, la requête continue non authentifiée.
 * Les exceptions lors du parsing/validation sont ignorées volontairement
 * (voir bloc catch), la requête reste alors non authentifiée.
 *
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtRequestFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * Point d’entrée du filtre pour chaque requête HTTP.
     * Étapes :
     * Récupère l’en-tête {@code Authorization}.
     * Vérifie le schéma {@code Bearer } et isole le token.
     * Extrait l’email ; si pas d’authentification déjà présente dans le contexte,
     * tente la validation du token.
     * En cas de succès, récupère le rôle, crée l’{@code Authentication} avec l’autorité
     * correspondante et l’enregistre dans le {@code SecurityContextHolder}.
     * Dans tous les cas, délègue au filtre suivant.
     * @param request requête HTTP entrante
     * @param response réponse HTTP
     * @param filterChain chaîne de filtres à poursuivre
     * @throws ServletException en cas d’erreur de filtre/servlet
     * @throws IOException en cas d’erreur d’E/S
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String header = request.getHeader("Authorization");

        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
            String email = jwtUtil.extractEmail(token);
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    if (jwtUtil.validateToken(token, email)) {
                        String role = jwtUtil.extractRole(token);
                        String granted = role != null && role.startsWith("ROLE_") ? role : "ROLE_" + role;

                        var auth = new UsernamePasswordAuthenticationToken(email, null, List.of(new SimpleGrantedAuthority(granted)));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }catch (Exception ignored) {
            }
        }

        filterChain.doFilter(request, response);
    }
}