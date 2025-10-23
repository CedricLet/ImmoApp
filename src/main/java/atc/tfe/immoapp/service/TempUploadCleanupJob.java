package atc.tfe.immoapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class TempUploadCleanupJob {
    private final FileStorageService storage;

    @Value("${uploads.tmp.ttl-minutes}")
    private long ttlMinutes;

    /**
     * Exécuté périodiquement.
     * - initialDelay: 60s après le démarrage (laisse le temps à l’app de se stabiliser)
     * - fixedDelay: configurable via properties (défaut 10 minutes)
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
