package atc.tfe.immoapp.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String baseDir;

    @Value("${app.upload.max-mb:15}")
    private int maxMB;

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

    public record StoredFile(String path, long size, String mime, String checksum) {}
}
