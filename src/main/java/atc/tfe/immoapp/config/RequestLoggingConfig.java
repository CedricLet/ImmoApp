package atc.tfe.immoapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

/**
 * Configuration d’un filtre de logging HTTP basé sur {@link CommonsRequestLoggingFilter}.
 * Objectif : journaliser les requêtes entrantes pour faciliter le debug (client, query string, en-têtes).
 * Comportement de ce filtre :
 * Inclut les informations client (adresse IP, session, utilisateur si présent).
 * Inclut la query string (partie après le ? dans l’URL).
 * N’inclut PAS le payload (corps) des requêtes.
 * Inclut tous les en-têtes HTTP.
 * Longueur max du payload loggé = 0 (sans effet ici car payload exclu).
 * Remarque : {@code CommonsRequestLoggingFilter} écrit dans les logs à un niveau DEBUG
 * sous le logger {@code org.springframework.web.filter.CommonsRequestLoggingFilter}.
 */
@Configuration
public class RequestLoggingConfig {

    /**
     * Déclare et configure un {@link CommonsRequestLoggingFilter} utilisé par Spring MVC.
     * @return le filtre configuré pour journaliser certaines métadonnées des requêtes
     */
    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter() {
        CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
        loggingFilter.setIncludeClientInfo(true);
        loggingFilter.setIncludeQueryString(true);
        loggingFilter.setIncludePayload(false);
        loggingFilter.setIncludeHeaders(false);
        loggingFilter.setMaxPayloadLength(0);
        return loggingFilter;
    }
}
