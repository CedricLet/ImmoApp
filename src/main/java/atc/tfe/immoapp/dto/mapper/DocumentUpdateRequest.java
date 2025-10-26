package atc.tfe.immoapp.dto.mapper;

import atc.tfe.immoapp.enums.DocumentCategory;
import atc.tfe.immoapp.enums.UtilityType;

import java.util.List;

public record DocumentUpdateRequest(
        DocumentCategory documentCategory,
        UtilityType utilityType,
        List<String> tags,
        String fileName
) {
}
