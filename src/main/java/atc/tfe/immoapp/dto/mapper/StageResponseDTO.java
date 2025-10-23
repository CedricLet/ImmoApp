package atc.tfe.immoapp.dto.mapper;

public record StageResponseDTO(
        String tempId,
        String originalFileName,
        String mimeType,
        long sizeBytes,
        AiExtraction ai
) { }
