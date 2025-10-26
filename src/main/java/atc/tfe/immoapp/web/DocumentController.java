package atc.tfe.immoapp.web;

import atc.tfe.immoapp.dto.mapper.*;
import atc.tfe.immoapp.enums.DocumentCategory;
import atc.tfe.immoapp.enums.UtilityType;
import atc.tfe.immoapp.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/document")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @GetMapping("/list")
    public DocumentListResponseDTO list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) DocumentCategory documentCategory,
            @RequestParam(required = false) UtilityType utilityType,
            @RequestParam(required = false) String tags, // csv
            @RequestParam(required = false) Long propertyId
    ){
        List<String> tagNames = (tags == null || tags.isBlank()) ? List.of() : Arrays.stream(tags.split(",")).map(String::trim)
                .filter(s -> !s.isBlank()).toList();

        return documentService.list(page, search, documentCategory, utilityType, tagNames, propertyId);
    }

    @PostMapping(value = "/stage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StageResponseDTO stageResponseDTO(@RequestPart("file") MultipartFile file) throws IOException {
        return documentService.stage(file);
    }

    @PostMapping("/finalize")
    public DocumentDTO finalizeFromTemp(
            @RequestParam("tempId") String tempId,
            @RequestParam("category") DocumentCategory category,
            @RequestParam(value = "utilityType", required = false) String utilityTypeRaw,
            @RequestParam(value = "tags", required = false) String tagsCsv,
            @RequestParam(value = "propertyId", required = false) Long propertyId,
            @RequestParam(value = "clientFileName", required = false) String clientFileName
    ){
        List<String> tags = (tagsCsv == null || tagsCsv.isBlank()) ? List.of() : List.of(tagsCsv);
        return documentService.finalizeFromTemp(
                tempId, category, DocumentService.parseUtilityOrNull(utilityTypeRaw), tags, propertyId, clientFileName
        );
    }

    @DeleteMapping("/discard")
    public void discard(@RequestParam("tempId")  String tempId){
        documentService.discardTemp(tempId);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentDTO upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam("category") DocumentCategory category,
            @RequestParam(value = "utilityType", required = false) String utilityTypeRaw,
            @RequestParam(value = "tags", required = false) String tagsCsv,
            @RequestParam(value = "propertyId", required = false) Long propertyId,
            @RequestParam(value = "clientFileName", required = false) String clientFileName
    ){
        List<String> tags = (tagsCsv == null || tagsCsv.isBlank()) ? List.of() : List.of(tagsCsv);
        return documentService.upload(
                file,
                category,
                DocumentService.parseUtilityOrNull(utilityTypeRaw),
                tags,
                propertyId,
                clientFileName
        );
    }

    // Fallback: accepte application/octet-stream (fichier seul)
    // Appel possible: POST /document/upload?category=INVOICE&utilityType=&tags=&propertyId=1&clientFileName=xxx.pdf
    @PostMapping(value = "/upload", consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public DocumentDTO uploadOctetStream(
            @RequestBody byte[] body,
            @RequestParam("category") DocumentCategory category,
            @RequestParam(value = "utilityType", required = false) String utilityTypeRaw,
            @RequestParam(value = "tags", required = false) String tagsCsv,
            @RequestParam(value = "propertyId", required = false) Long propertyId,
            @RequestParam(value = "clientFileName", required = false) String clientFileName
    ) {
        if (body == null || body.length == 0) {
            throw new IllegalArgumentException("Fichier vide");
        }
        var file = new org.springframework.mock.web.MockMultipartFile(
                "file",
                (clientFileName == null || clientFileName.isBlank()) ? "upload.pdf" : clientFileName,
                MediaType.APPLICATION_PDF_VALUE,
                body
        );
        List<String> tags = (tagsCsv == null || tagsCsv.isBlank()) ? List.of() : List.of(tagsCsv);

        return documentService.upload(
                file,
                category,
                DocumentService.parseUtilityOrNull(utilityTypeRaw),
                tags,
                propertyId,
                clientFileName
        );
    }


    @PostMapping(value = "/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AiExtraction preview(@RequestPart("file") MultipartFile file) {
        return documentService.preview(file);
    }


    @PutMapping("/{id}")
    public DocumentDTO update(@PathVariable Long id, @RequestBody DocumentUpdateRequest req){
        return documentService.updateMetadata(id, req.documentCategory(), req.utilityType(), req.tags(), req.fileName());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        documentService.delete(id);
    }
}
