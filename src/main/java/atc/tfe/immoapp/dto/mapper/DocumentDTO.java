package atc.tfe.immoapp.dto.mapper;

import atc.tfe.immoapp.enums.DocumentCategory;
import atc.tfe.immoapp.enums.UtilityType;

import java.time.Instant;
import java.util.List;

public record DocumentDTO(
        Long id,
        String fileName,
        String mimeType,
        Long sizeBytes,
        String storagePath,
        DocumentCategory documentCategory,
        Instant uploadedAt,
        Long propertyId,
        UtilityType utilityType,
        List<String> tags
) {
}
