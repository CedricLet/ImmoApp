package atc.tfe.immoapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration des ressources statiques pour exposer les fichiers uploadés.
 *  Cette configuration mappe toutes les requêtes HTTP dont le chemin commence par
 *  /uploads/** vers un répertoire local du système de fichiers,
 *  uploads/ (chemin relatif à l’exécution de l’application).
 *  Exemple : une requête GET sur /uploads/photo.jpg servira le fichier
 *  uploads/photo.jpg si celui-ci existe sur le disque.
 *  Détails
 *  Le préfixe file: indique à Spring d’utiliser le système de fichiers.
 *  Le chemin uploads/ est relatif au répertoire de travail du process Java
 *  (souvent le root du projet en dev, ou le répertoire de déploiement en prod).
 *  Cette classe complète la configuration de sécurité : dans ta SecurityConfig, le
 *  chemin /uploads/** est en permitAll(), permettant l’accès public.
 *
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    /**
     * Déclare un handler pour servir les ressources statiques depuis le disque.
     * Associe le pattern d’URL /uploads/** au répertoire local
     * uploads/ via l’URL de ressource file:uploads/
     * @param registry registre des handlers de ressources statiques
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/uploads/**").addResourceLocations("file:uploads/");
    }
}
