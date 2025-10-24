package atc.tfe.immoapp.dto.mapper;

import java.util.List;

public record DocumentListResponseDTO(
        List<DocumentDTO> content,
        long totalElements
) {
}
