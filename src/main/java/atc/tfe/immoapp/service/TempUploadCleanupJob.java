package atc.tfe.immoapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Tâche planifiée chargée de purger périodiquement les fichiers d’upload temporaires.
 * Le job invoque {@link FileStorageService#purgeTempsOlderThan(Duration)} avec un TTL
 * (Time To Live) exprimé en minutes, configurable via la propriété
 * {@code uploads.tmp.ttl-minutes}.
 * <p>
 * Planification
 * initialDelay : 60 secondes après le démarrage de l’application.
 * fixedDelay : délai entre deux exécutions, configurable via
 * {@code uploads.tmp.cleanup-interval-ms} (défaut 600000 ms = 10 min).
 * <p>
 * Notes
 * Nécessite l’activation de la planification Spring
 * (annotation {@code @EnableScheduling} dans une classe de configuration).
 * Les exceptions sont volontairement ignorées pour ne pas faire échouer le job.
 */
@Component
@RequiredArgsConstructor
public class TempUploadCleanupJob {
    private final FileStorageService storage;

    @Value("${uploads.tmp.ttl-minutes}")
    private long ttlMinutes;

    /**
     * Exécution périodique de la purge des temporaires.
     * - Démarre 60s après le lancement de l’application (initialDelay).<br>
     * - Se ré-exécute après un délai fixe entre la fin et le début suivant (fixedDelay).
     * En cas d’exception, le job continue silencieusement.
     */
    @Scheduled(
            initialDelay = 60_000,
            fixedDelayString = "${uploads.tmp.cleanup-interval-ms:600000}"
    )
    public void run() {
        try {
            storage.purgeTempsOlderThan(Duration.ofMinutes(ttlMinutes));
        } catch (Exception ignored) {
            // On ne fait pas échouer le job si un fichier ne peut pas être supprimé
        }
    }
}
