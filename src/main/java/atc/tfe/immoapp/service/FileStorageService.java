package atc.tfe.immoapp.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;


/**
 * Service de gestion de fichiers uploadés : stockage temporaire, validation basique,
 * déplacement en stockage final, purge des temporaires, et suppression.
 * <p>
 * Paramètres configurables (avec valeurs par défaut) :
 * {@code uploads.tmp.dir} (par défaut {@code uploads/tmp}) : dossier des fichiers temporaires.
 * {@code uploads.docs.dir} (par défaut {@code uploads/docs}) : dossier de stockage final des documents.
 * {@code app.upload.dir} (par défaut {@code uploads}) : base des dossiers d’upload horodatés.
 * {@code app.upload.max-mb} (par défaut {@code 15}) : taille max autorisée pour {@link #store(MultipartFile)}.
 * <p>
 * Fonctions principales
 * {@link #storeTemp(MultipartFile)} : enregistre un fichier tel quel en zone temporaire et retourne ses métadonnées.
 * {@link #moveTempToFinal(String, String)} : déplace un temp vers le dossier final en lui donnant un nom déterministe.
 * {@link #discardTemp(String)} : supprime un temp s’il existe.
 * {@link #purgeTempsOlderThan(Duration)} : supprime les temps plus vieux qu’un TTL donné.
 * {@link #store(MultipartFile)} : pipeline “prod” imposant PDF + limite de taille + stockage horodaté + checksum SHA-256.
 * {@link #delete(String)} : supprime un fichier par son chemin relatif sécurisé sous {@code uploads/}.
 */
@Service
@RequiredArgsConstructor
public class FileStorageService {
    @Value("${uploads.tmp.dir:uploads/tmp}")
    private String tmpDir;

    @Value("${uploads.docs.dir:uploads/docs}")
    private String docsDir;

    @Value("${app.upload.dir:uploads}")
    private String baseDir;

    @Value("${app.upload.max-mb:15}")
    private int maxMB;

    /**
     * Stocke un fichier en zone temporaire et retourne ses métadonnées minimales.
     * L’extension est héritée du nom original s’il en a une, sinon {@code .pdf}.
     * Le type MIME est détecté via {@link Files#probeContentType(Path)} et vaut {@code application/pdf} par défaut si inconnu.
     * @param file le fichier multipart reçu
     * @return objet décrivant le fichier temporaire (id, chemin, mime, taille)
     * @throws IllegalStateException si une erreur E/S survient
     */
    public TempStored storeTemp(MultipartFile file) {
        try {
        Path dir = Paths.get(tmpDir);
        Files.createDirectories(dir);

        if (file.getSize() > maxMB) {
            throw new IOException("File is too large");
        }

        String tempId = UUID.randomUUID().toString().replace("-", "");
        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf(".")))
                .orElse(".pdf");

        String fileName = tempId + ext;
        Path dest = dir.resolve(fileName);

        try (InputStream in = file.getInputStream()){
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }
        String mime = Files.probeContentType(dest);
        if (mime == null) mime = "application/pdf";
        long size = Files.size(dest);
        return new TempStored(tempId, dest.toString(), mime, size);
        }catch (IOException e) {
            throw new IllegalStateException("Cannot store temp file", e);
        }
    }

    /**
     * Déplace un fichier temporaire identifié par son {@code tempId} vers le dossier final.
     * Le nom de fichier final est forcé à l’extension {@code .pdf} si elle n’est pas présente.
     * @param tempId identifiant du fichier temporaire (préfixe du nom physique)
     * @param finalFileName nom de fichier souhaité (sans ou avec .pdf)
     * @return le {@link Path} de destination après déplacement
     * @throws IOException si le temp n’existe pas ou en cas d’erreur E/S
     */
    public Path moveTempToFinal(String tempId, String finalFileName) throws IOException {
        Path src = findTempByIdOrThrow(tempId);
        Path finalDirPath = Paths.get(docsDir);
        Files.createDirectories(finalDirPath);

        if (!finalFileName.toLowerCase().endsWith(".pdf")) {
            finalFileName = finalFileName + ".pdf";
        }
        Path target = finalDirPath.resolve(finalFileName);
        return Files.move(src, target, StandardCopyOption.REPLACE_EXISTING);
    }

    /**
     * Supprime silencieusement un fichier temporaire (si trouvé) pour un {@code tempId}.
     * @param tempId identifiant du fichier temporaire
     */
    public void discardTemp(String tempId) {
        try {
            Path p = findTempById(tempId);
            if (p != null) Files.deleteIfExists(p);
        } catch (IOException ignored) {
            // ignored
        }
    }

    /**
     * Purge les fichiers temporaires plus anciens que le TTL fourni.
     * Ne parcourt que le niveau direct du dossier temporaire.
     * @param ttl durée de rétention maximale (ex. PT1H, P1D)
     */
    // ====== Purge: supprime les fichiers plus vieux que TTL ======
    public void purgeTempsOlderThan(Duration ttl) {
        Path dir = Paths.get(tmpDir);
        if (!Files.exists(dir)) return;

        Instant cutoff = Instant.now().minus(ttl);
        try (Stream<Path> files = Files.list(dir)) {
            files.filter(Files::isRegularFile)
                    .filter(p -> {
                        try {
                            return Files.getLastModifiedTime(p).toInstant().isBefore(cutoff);
                        } catch (IOException e) {
                            return false;
                        }
                    })
                    .forEach(p -> {
                        try {
                            Files.deleteIfExists(p);
                        } catch (IOException ignored) {
                            // Si fichier verrouillé / en cours d’utilisation, on ignore; on réessaiera plus tard
                        }
                    });
        } catch (IOException ignored) {
            // ignored
        }
    }

    /**
     * Recherche un temp par son id et lève une exception s’il est introuvable.
     * @param tempId identifiant temp
     * @return le chemin du fichier trouvé
     * @throws IOException si problème d’accès
     * @throws IllegalArgumentException si non trouvé
     */
    private Path findTempByIdOrThrow(String tempId) throws IOException {
        Path p = findTempById(tempId);
        if (p == null) throw new IllegalArgumentException("Temp file not found for id=" + tempId);
        return p;
    }

    /**
     * Recherche un temp par son id (matche le début du nom de fichier).
     * @param tempId identifiant temp
     * @return le {@link Path} du fichier, ou {@code null} si absent
     * @throws IOException si problème d’accès
     */
    private Path findTempById(String tempId) throws IOException {
        Path dir = Paths.get(tmpDir);
        if (!Files.exists(dir)) return null;

        try (Stream<Path> files = Files.list(dir)) {
            return files
                    .filter(Files::isRegularFile)
                    .filter(p -> p.getFileName().toString().startsWith(tempId))
                    .findFirst()
                    .orElse(null);
        }
    }

    /**
     * Stockage “final” d’un fichier PDF avec validations :
     * non null & non vide ;
     * type {@code application/pdf} ;
     * taille ≤ {@code maxMB} ;
     * écriture dans {@code baseDir/YYYY/MM} avec nom aléatoire ;
     * calcul du checksum SHA-256 pour traçabilité.
     * @param file fichier à enregistrer (attendu PDF)
     * @return métadonnées du fichier stocké (chemin relatif, taille, mime, checksum)
     * @throws RuntimeException enveloppe d’exceptions E/S ou validation
     */
    public StoredFile store(MultipartFile file){
        if (file == null || file.isEmpty()){
            throw new IllegalArgumentException("Le fichier est vide");
        }
        // Pour une sécurité renforcée, ajouté un contrôle supplémentaire comme signature du PDF "%PDF-" ou librairie PDF
        if (!MediaType.APPLICATION_PDF_VALUE.equalsIgnoreCase(file.getContentType())){
            throw new IllegalArgumentException("Seuls les PDF sont autorisés !");
        }
        long sizeBytes = file.getSize();
        if (sizeBytes > maxMB * 1024L * 1024L){
            throw new IllegalArgumentException("Le fichier est trop grand");
        }

        LocalDate today = LocalDate.now();
        String dir = String.format("%s/%04d/%02d", baseDir, today.getYear(), today.getMonthValue());
        Path dirPath = Path.of(dir).normalize();
        try {
            Files.createDirectories(dirPath);
            String uuid = UUID.randomUUID().toString().replace("-", "");
            String cleanName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf");
            String ext = cleanName.toLowerCase().endsWith(".pdf") ? "" : ".pdf";
            String fileName = uuid + ext;
            Path target = dirPath.resolve(fileName).normalize();

            if (!target.startsWith(dirPath)){
                throw new IllegalArgumentException("Chemin invalide");
            }

            try (InputStream in = file.getInputStream()){
                Files.copy(in, target);
            }

            String checksum;
            try (InputStream in = Files.newInputStream(target)) {
                checksum = DigestUtils.sha256Hex(in);
            }

            String relative = dir + "/" + fileName; // ex: uploads/2025/10/uuid.pdf
            return new StoredFile(relative, sizeBytes, MediaType.APPLICATION_PDF_VALUE, checksum);

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'enregistrement du fichier", e);
        }
    }

    /**
     * Supprime un fichier par son chemin relatif sous {@code uploads/}, avec garde-fous.
     * Le chemin est normalisé, et la suppression refusée si l’emplacement
     * ne commence pas par {@code baseDir} ni par {@code uploads/}.
     * @param relativePath chemin relatif (ex. {@code uploads/2025/10/uuid.pdf})
     */
    public void delete(String relativePath){
        if (relativePath == null || relativePath.isBlank()) return;
        try {
            Path p = Path.of(relativePath).normalize();
            // autoriser uploads/... même si baseDir = "uploads"
            if (!p.startsWith(baseDir) && !relativePath.startsWith("uploads/")) {
                throw new IllegalArgumentException("Refus de suppression en dehors du dossier uploads");
            }
            Files.deleteIfExists(p);
        }catch (Exception ignored){
            // ignored
        }
    }

    public record TempStored(String tempId, String path, String mime, long size){}
    public record StoredFile(String path, long size, String mime, String checksum) {}
}
