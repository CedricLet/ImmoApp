package atc.tfe.immoapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import atc.tfe.immoapp.filter.JwtRequestFilter;

/**
 * Configuration principale de la sécurité Spring (Spring Security)
 * Elle définit :
 * - {@link PasswordEncoder} (BCrypt) pour le hachage des mots de passe.
 * - {@link AuthenticationManager} utilisé pour l'authentification basée sur un Provider.
 * - {@link SecurityFilterChain} CORS, CSRF, endpoints publics, stratégie de session (stateless), et insertion du filtre JWT
 * - La configuration CORS via un {@link CorsConfigurationSource} explicite.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    /**
     * Inject le filtre JWT personnalisé qui valide le token et peuple le SecurityContext.
     * @param jwtRequestFilter filtre d'analyse et de validation des requêtes JWT
     */
    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    /**
     * Déclare l'encodeur de mots de passe basé sur BCrypt.
     * @return un {@link BCryptPasswordEncoder}
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Déclare un {@link AuthenticationManager} basé sur un {@link DaoAuthenticationProvider}.
     * Le provider s'appuie classiquement sur un {@code UserDetailsService}
     * @return un {@link ProviderManager} contenant un {@link DaoAuthenticationProvider}
     */
    @Bean
    public AuthenticationManager authenticationManagerBean() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authenticationProvider);
    }

    /**
     * Construit la chaine de filtre de sécurité HTTP.
     * - Désactive CSRF
     * - Active CORS
     * - Définit les endpoints publics
     * - Autorise toutes les requêtes OPTIONS
     * - Exige l'authentification pour le reste
     * - Session en mode STATELESS
     * - Désactive le formLogin
     * - Ajout le filtre JWT avant le {@link UsernamePasswordAuthenticationFilter}
     * @param http builder Spring Security
     * @return la {@link SecurityFilterChain} prête à l'emploi
     * @throws Exception en cas d'erreur de construction
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(reg -> reg
                        .requestMatchers(
                                "/error",
                                "/api/health", "/api/health/**",
                                "/actuator/health",
                                "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
                                "/login",
                                "/signup",
                                "/uploads/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable);

                // Ajout du filtre JWT
                http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Source de configuration CORS pour Spring Security
     * @return un {@link CorsConfigurationSource} mappé sur /**
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration config = new CorsConfiguration();
            config.addAllowedOrigin("http://localhost:4200");
            config.addAllowedMethod("*");
            config.addAllowedHeader("*");
            config.setAllowCredentials(true);
            config.addExposedHeader("Authorization");
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", config);
            return source;
    }
}
