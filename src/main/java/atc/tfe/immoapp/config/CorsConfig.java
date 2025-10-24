package atc.tfe.immoapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration CORS (Cross-Origin Resource Sharing) pour l'application.
 * Objectif : autoriser le front-end Angular (par défaut sur localhost:4200)
 * à appeler l'API Spring (:8080) sans être bloqué par le navigateur.
 */
@Configuration
public class CorsConfig {

    /**
     * Déclare WebMvcConfigurer chargé d'ajouter les mappings CORS.
     * @return une instance de {@link WebMvcConfigurer} configurant CORS
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            /**
             * Enregistre les règles CORS sur le registre global.
             * Ici, on autorise le front Angular à appeler tous les endpoints
             * et ce pour les méthodes GET/POST/PUT/DELETE.
             * @param registry le registre où l'on déclare les règles CORS
             */
            @Override public void addCorsMappings (CorsRegistry registry){
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
