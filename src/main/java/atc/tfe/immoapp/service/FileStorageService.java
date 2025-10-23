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

    public TempStored storeTemp(MultipartFile file) {
        try {
        Path dir = Paths.get(tmpDir);
        Files.createDirectories(dir);

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

    public void discardTemp(String tempId) {
        try {
            Path p = findTempById(tempId);
            if (p != null) Files.deleteIfExists(p);
        } catch (IOException ignored) {
            // ignored
        }
    }

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

    // ====== Helpers ======
    private Path findTempByIdOrThrow(String tempId) throws IOException {
        Path p = findTempById(tempId);
        if (p == null) throw new IllegalArgumentException("Temp file not found for id=" + tempId);
        return p;
    }

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

    public StoredFile store(MultipartFile file){
        if (file == null || file.isEmpty()){
            throw new IllegalArgumentException("Le fichier est vide");
        }
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
