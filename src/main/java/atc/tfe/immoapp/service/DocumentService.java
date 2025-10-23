package atc.tfe.immoapp.service;

import atc.tfe.immoapp.ai.AiService;
import atc.tfe.immoapp.domain.*;
import atc.tfe.immoapp.dto.mapper.AiExtraction;
import atc.tfe.immoapp.dto.mapper.DocumentDTO;
import atc.tfe.immoapp.dto.mapper.DocumentListResponseDTO;
import atc.tfe.immoapp.enums.DocumentCategory;
import atc.tfe.immoapp.enums.UtilityType;
import atc.tfe.immoapp.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {
    public static final String PROMPT = """
            Tu es un extracteur documentaire pour une app immo. Lis le texte ci-dessous (PDF OCRisé).\s
             Retourne STRICTEMENT un JSON unique, sans texte avant/après, respectant ce schéma et ces ENUM.
    
             ENUMS
             - DocumentCategory: ["CONTRACT","INVOICE","TAX","WORK","INSURANCE","PHOTO","OTHER","PEB"]
             - UtilityType: ["ELECTRICITY","GAS","WATER","FUEL","PELLET","WOOD","COAL","SOLAR_PV", null]
    
             EXIGENCES
             - fileName: si possible, propose un nom fichier en kebab-case, .pdf. Si non déductible, réutilise ${originalFileName} nettoyé.
             - documentCategory: choisis UNE valeur de l’ENUM.
             - utilityType: une valeur de l’ENUM UtilityType ou null si non pertinent (ex: CONTRACT => null).
             - tags: liste courte (3–8) de tags pertinents pris dans ce set autorisé:
               ["TO_REVIEW","TO_COMPLETE","TO_PAY","PAID","IMPORTANT","ARCHIVED","URGENT","FOLLOW_UP","MISSING_PAGES",
               "NEEDS_SIGNATURE","SIGNED","TO_SEND","SENT","RECEIVED","DRAFT","FINAL","DUPLICATE","OUTDATED","EXPENSE",
               "RECURRING","ONE_OFF","REFUND","ADVANCE","DEPOSIT","GUARANTEE","LATE_FEE","TAX_DEDUCTIBLE","NON_DEDUCTIBLE",
               "VAT_INCLUDED","VAT_EXCLUDED","VAT_6","VAT_12","VAT_21","LANDLORD","TENANT","SYNDIC","PROVIDER","CONTRACTOR",
               "INSURER","BROKER","KITCHEN","BATHROOM","ROOF","FACADE","GARDEN","GARAGE","BOILER_ROOM","ELECTRICAL","PLUMBING",
               "WINDOWS","INSULATION","MAINTENANCE","REPAIR","RENOVATION","INSTALLATION","INSPECTION","EMERGENCY","ELECTRICITY",
               "GAS","WATER","DISTRICT_HEATING","FUEL_OIL","WOOD_PELLETS","SOLAR_PV","INTERNET","TELECOM","WASTE","SEWAGE",
               "SAFETY_CHECK","GAS_CHECK","ELECTRICAL_CHECK","BOILER_SERVICE","CHIMNEY_SWEEP","PEB_CERTIFICATE","LEASE",
               "TERMINATION","AMENDMENT","ANNEX","INSPECTION_REPORT","ENTRY_INVENTORY","EXIT_INVENTORY","GUARANTEE_BOND",
               "INVOICE","CONTRACT","RECEIPT","QUOTE","QUOTE_APPROVED","QUOTE_REJECTED","WARRANTY","CLAIM","INSURANCE_POLICY",
               "SYNDIC_REPORT","TAX"]
             - extracted: sous-objet libre pour infos utiles si trouvées (ex: invoiceNumber, invoiceDate, dueDate, periodStart, periodEnd, totalAmount, currency, provider, address, pebLabel, pebKwhPerM2, contractDuration, etc.). Ne mets pas de champs absents.
    
             RENVOIE UNIQUEMENT:
             {
               "fileName": "string.pdf",
               "documentCategory": "…",
               "utilityType": "…" | null,
               "tags": ["…","…"],
               "extracted": { "...": "..." }
             }
    
             TEXTE PDF:
             ${text}
            """;

    private final DocumentRepository documentRepository;
    private final DocumentTagRepository tagRepository;
    private final DocumentHasTagRepository pivotRepository;
    private final FileStorageService storage;
    private final CurrentUserService currentUserService;
    private final AiService aiService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserPropertyRepository userPropertyRepository;

    public DocumentListResponseDTO list(
            int page,
            String search,
            DocumentCategory category,
            UtilityType utilityType,
            List<String> tagNames,
            Long propertyId
    ){
        User current = currentUserService.getCurrentUser();
        Pageable pageable = PageRequest.of(Math.max(0,page),10, Sort.by(Sort.Direction.DESC,"updatedAt", "id"));

        Specification<Document> spec = Specification.allOf(
                DocumentSpecifications.byUploader(current),
                DocumentSpecifications.searchTerm(search),
                DocumentSpecifications.byCategory(category),
                DocumentSpecifications.byUtility(utilityType),
                DocumentSpecifications.byPropertyId(propertyId),
                DocumentSpecifications.hasAllTags(normalizeList(tagNames))
        );

        Page<Document> p = documentRepository.findAll(spec, pageable);
        Map<Long, List<String>> tagMap = loadTagsMap(p.getContent().stream().map(Document::getId).toList());

        List<DocumentDTO> dtos = p.getContent().stream().map(d -> new DocumentDTO(
                d.getId(),
                d.getFileName(),
                d.getMimeType(),
                d.getSizeBytes(),
                d.getStoragePath(),
                d.getDocumentCategory(),
                d.getUploadedAt(),
                d.getProperty() != null ? d.getProperty().getId() : null,
                d.getUtilityType(),
                tagMap.getOrDefault(d.getId(), List.of())
        )).toList();

        return new DocumentListResponseDTO(dtos, p.getTotalElements());
    }

    @Transactional
    public DocumentDTO upload(
            MultipartFile file,
            DocumentCategory category,
            UtilityType utilityType,
            List<String> tagsCsvOrList,
            Long propertyId,
            String clientFileName
    ) {
        User current = currentUserService.getCurrentUser();
        if (current == null) throw new IllegalStateException("Unauthenticated");

        // Stockage fichier
        var stored = storage.store(file);

        // Choix du nom fichier
        String chosenName = (clientFileName != null && !clientFileName.isBlank())
                ? clientFileName.trim()
                : file.getOriginalFilename();
        if (chosenName == null || chosenName.isBlank()) chosenName = "document.pdf";
        if (!chosenName.toLowerCase().endsWith(".pdf")) chosenName += ".pdf";

        // Entité
        Document d = new Document();
        d.setFileName(file.getOriginalFilename());
        d.setMimeType(stored.mime());
        d.setSizeBytes(stored.size());
        d.setStoragePath(stored.path());
        d.setDocumentCategory(category);
        d.setUtilityType(utilityType);
        d.setUploadedBy(current);
        d.setUploadedAt(Instant.now());
        d.setCreatedAt(Instant.now());
        d.setUpdatedAt(Instant.now());
        if (propertyId != null){
            Property pId = new Property();
            pId.setId(propertyId);
            // Vérifier : user doit être lié à ce bien
            boolean allowed = userPropertyRepository.existsByUserAndProperty(current, pId);
            if (!allowed) {
                throw new SecurityException("User not allowed to upload document, you don't own this property");
            }
            Property p = new Property();
            p.setId(propertyId);
            d.setProperty(p);
        }
        d = documentRepository.save(d);

        // Tag init via formulaire
        Set<String> tagNames = new HashSet<>(normalizeCsvOrList(tagsCsvOrList));

        // Enrichissement AI
        try {
            String text = extractPdftext(file);
            String prompt = buildAiPrompt(chosenName, text);
            String aiJson = aiService.quickAnswer(prompt);
            AiExtraction x = parseAi(aiJson);
            if (x != null) {
                // si AI propose une autre catégorie/utilityType plausible, on la garde ou si front coche "auto"
                if (x.documentCategory() != null) d.setDocumentCategory(x.documentCategory());
                if (x.utilityType() != null) d.setUtilityType(x.utilityType());
                if (x.suggestedFileName() != null && x.suggestedFileName().toLowerCase().endsWith(".pdf")){
                    d.setFileName(x.suggestedFileName());
                }
                tagNames.addAll(normalizeList(x.tags()));
                d.setUpdatedAt(Instant.now());
                documentRepository.save(d);
            }
        }catch (Exception ignored){
            // ignore the exception
        }

        // Attacher les tags
        replaceTags(d.getId(), tagNames);

        // DTO
        return getDocumentDTO(d);
    }

    private DocumentDTO getDocumentDTO(Document d) {
        Map<Long, List<String>> tagMap = loadTagsMap(List.of(d.getId()));
        return new DocumentDTO(
                d.getId(), d.getFileName(), d.getMimeType(), d.getSizeBytes(), d.getStoragePath(),
                d.getDocumentCategory(), d.getUploadedAt(),
                d.getProperty() != null ? d.getProperty().getId() : null,
                d.getUtilityType(), tagMap.getOrDefault(d.getId(), List.of())
        );
    }

    @Transactional
    public DocumentDTO updateMetadata(Long id, DocumentCategory category, UtilityType utilityType, List<String> tags){
        User current = currentUserService.getCurrentUser();
        Document d = documentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Document not found"));

        // Authorization: uploader only
        if (current == null || !Objects.equals(d.getUploadedBy().getId(), current.getId())) {
            throw new SecurityException("Forbidden");
        }

        d.setDocumentCategory(category);
        d.setUtilityType(utilityType);
        d.setUpdatedAt(Instant.now());
        documentRepository.save(d);

        replaceTags(d.getId(), new HashSet<>(normalizeList(tags)));

        return getDocumentDTO(d);
    }

    @Transactional
    public void delete(Long id){
        User current = currentUserService.getCurrentUser();
        Document d = documentRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Document not found"));
        if (current == null || !Objects.equals(d.getUploadedBy().getId(), current.getId())) {
            throw new SecurityException("Forbidden");
        }
        String path = d.getStoragePath();
        pivotRepository.deleteByDocumentId(id);
        documentRepository.delete(d);
        storage.delete(path);
    }

    public static UtilityType parseUtilityOrNull(String raw){
        if (raw == null || raw.isBlank()) return null;
        String x = raw.trim().toUpperCase();
        return switch (x) {
            case "FUEL", "FUEL-OIL", "FUELOIL", "MAZOUT", "FUEL_OIL" -> UtilityType.FUEL_OIL;
            case "PELLET", "WOOD_PELLETS", "WOOD-PELLETS", "PELLETS" -> UtilityType.PELLETS;
            default -> UtilityType.valueOf(x);
        };
    }

    public AiExtraction preview(MultipartFile file){
        String text = extractPdftext(file);
        String prompt = buildAiPrompt(safeOriginalName(file), text);
        try {
            String aiJson = aiService.quickAnswer(prompt);
            AiExtraction x = parseAi(aiJson);
            if (x != null) {
                return new AiExtraction(
                        x.documentCategory(),
                        x.utilityType(),
                        normalizeList(x.tags()),
                        x.suggestedFileName()
                );
            }
        }catch (Exception ignored){
            // ignored
        }
        return new AiExtraction(null, null, List.of(), null);
    }

    private String safeOriginalName(MultipartFile file){
        String n = file.getOriginalFilename();
        return (n == null || n.isBlank()) ? "document.pdf" : n;
    }

    private String extractPdftext(MultipartFile file){
        try (var in = file.getInputStream();
            var doc = PDDocument.load(in)){
            var stripper = new PDFTextStripper();
            stripper.setSortByPosition(Boolean.TRUE);
            return stripper.getText(doc);
        }catch (Exception e){
            return "";
        }
    }


    private String buildAiPrompt(String originalFileName, String text) {
        return PROMPT
                .replace("${text}", text == null ? "" : text)
                .replace("${originalFileName}", originalFileName == null ? "" : originalFileName);
    }

    private AiExtraction parseAi(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            var node = objectMapper.readTree(json);
            var cat = node.hasNonNull("documentCategory") ? DocumentCategory.valueOf(node.get("documentCategory").asText()) : null;
            UtilityType util = null;
            if (node.has("utilityType") && !node.get("utilityType").isNull()) {
                // tolérance sur legacy valeurs
                String raw = node.get("utilityType").asText();
                util =mapUtilityValue(raw);
            }
            List<String> tags = new ArrayList<>();
            if (node.has("tags") && node.get("tags").isArray()) {
                node.get("tags").forEach(t -> {
                    if (t.isTextual()) tags.add(t.asText().toUpperCase());
                });
            }
            String suggested = node.hasNonNull("suggestedFileName") ? node.get("suggestedFileName").asText() : null;
            return new AiExtraction(cat, util, tags, suggested);
        }catch (Exception e) {
            return null;
        }
    }

    private static UtilityType mapUtilityValue(String raw){
        String x = (raw == null ? "" : raw).trim().toUpperCase()
                .replace('-', '_')
                .replace(' ', '_');

        return switch (x) {
            case "FUEL", "FUEL-OIL", "FUELOIL", "MAZOUT", "FUEL_OIL" -> UtilityType.FUEL_OIL;
            case "PELLET", "WOOD_PELLETS", "WOOD-PELLETS", "PELLETS" -> UtilityType.PELLETS;
            default -> UtilityType.valueOf(x);
        };
    }

    private List<String> normalizeCsvOrList(List<String> maybeCsv){
        if (maybeCsv == null) return List.of();
        return maybeCsv.stream()
                .filter(Objects::nonNull)
                .flatMap(s -> Arrays.stream(s.split(",")))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toUpperCase)
                .distinct()
                .toList();
    }

    private List<String> normalizeList(List<String> list) {
        if (list == null) return List.of();
        return list.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toUpperCase)
                .distinct()
                .toList();
    }

    private void replaceTags(Long documentId, Set<String> names){
        pivotRepository.deleteByDocumentId(documentId);
        if (names == null || names.isEmpty()) return;

        // find or create
        Map<String, DocumentTag> found = tagRepository.findByNameIn(names).stream()
                .collect(Collectors.toMap(DocumentTag::getName, t -> t));
        Instant now = Instant.now();
        List<DocumentHasTag> links = new ArrayList<>();
        for (String n : names) {
            DocumentTag tag = found.computeIfAbsent(n, k -> {
                DocumentTag t = new DocumentTag();
                t.setName(k);
                t.setCreatedAt(now);
                t.setUpdatedAt(now);
                return tagRepository.save(t); // persiste et renvoie l’entité avec son id
            });

            DocumentHasTag link = getDocumentHasTag(documentId, tag, now);

            links.add(link);
        }

        pivotRepository.saveAll(links);
    }

    private static DocumentHasTag getDocumentHasTag(Long documentId, DocumentTag tag, Instant now) {
        DocumentHasTag link = new DocumentHasTag();
        DocumentHasTagId id = new DocumentHasTagId();
        id.setDocumentId(documentId);
        id.setDocumentTagId(tag.getId());
        link.setId(id);

        Document docRef = new Document();
        docRef.setId(documentId);
        link.setDocument(docRef);

        link.setDocumentTag(tag);
        link.setCreatedAt(now);
        link.setUpdatedAt(now);
        return link;
    }

    private Map<Long, List<String>> loadTagsMap(List<Long> docIds){
        if (docIds == null || docIds.isEmpty()) return Map.of();
        Map<Long, List<String>> map = new HashMap<>();
        for (Object[] row : pivotRepository.findTagNamesByDocumentIds(docIds)) {
            Long id = ((Number) row[0]).longValue();
            String name = (String) row[1];
            map.computeIfAbsent(id, k -> new ArrayList<>()).add(name);
        }
        return map;
    }
}
