package atc.tfe.immoapp.web;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import atc.tfe.immoapp.domain.Cost;
import atc.tfe.immoapp.domain.Document;
import atc.tfe.immoapp.domain.Lease;
import atc.tfe.immoapp.domain.Property;
import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.dto.mapper.AddCostDTO;
import atc.tfe.immoapp.dto.mapper.AddLeaseDTO;
import atc.tfe.immoapp.dto.mapper.CostAccountingRequestDTO;
import atc.tfe.immoapp.dto.mapper.CostRequestDTO;
import atc.tfe.immoapp.dto.mapper.ModifyCostDTO;
import atc.tfe.immoapp.dto.mapper.PropertyInfoResponse;
import atc.tfe.immoapp.dto.mapper.PropertyListDTO;
import atc.tfe.immoapp.enums.CostType;
import atc.tfe.immoapp.enums.LeaseStatus;
import atc.tfe.immoapp.enums.PropertyStatus;
import atc.tfe.immoapp.repository.CostRepository;
import atc.tfe.immoapp.repository.PropertyRepository;
import atc.tfe.immoapp.repository.UserPropertyRepository;
import atc.tfe.immoapp.repository.UserRepository;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/cost")
public class CostController {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CostRepository costRepository;
    private final UserPropertyRepository userPropertyRepository;


    public CostController(PropertyRepository propertyRepository, UserRepository userRepository, CostRepository costRepository, UserPropertyRepository userPropertyRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.costRepository = costRepository;
        this.userPropertyRepository = userPropertyRepository;
    }

    @GetMapping("/list/{propertyId}")
    public ResponseEntity<?> getCosts(@RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String search, @PathVariable Long propertyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);

        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);

        if (propertyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found");
        }

        Property property = propertyOpt.get();

        boolean ownsProperty = userPropertyRepository.existsByUserAndProperty(user, property);
        if (!ownsProperty) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        Pageable pageable = PageRequest.of(page, 10);

        Page<Cost> result;

        if (search != null && !search.isBlank()) {
            result = costRepository.searchCosts(search, property, pageable);
        } else {
            result = costRepository.findAllByProperty(property, pageable);
        }

        Page<CostRequestDTO> dtoPage = result.map(c ->
            new CostRequestDTO(
                c.getId(),
                c.getLabel(),
                c.getCostCategory(),
                c.getCurrency(),
                c.getAmount(),
                c.getInvoiceDate().toString(),
                c.getCostType(),
                c.getNotes()
            )
        );

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCost(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);

        Optional<Cost> costOpt = costRepository.findById(id);

        if (costOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cost not found");
        }

        Cost cost = costOpt.get();

        Property property = cost.getProperty();

        boolean ownsProperty = userPropertyRepository.existsByUserAndProperty(user, property);
        if (!ownsProperty) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        CostRequestDTO dto =
            new CostRequestDTO(
                cost.getId(),
                cost.getLabel(),
                cost.getCostCategory(),
                cost.getCurrency(),
                cost.getAmount(),
                cost.getInvoiceDate().toString(),
                cost.getCostType(),
                cost.getNotes()
            );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/accounting/{propertyId}")
    public ResponseEntity<?> getCostAccounting(@PathVariable Long propertyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);

        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);

        if (propertyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found");
        }

        Property property = propertyOpt.get();

        boolean ownsProperty = userPropertyRepository.existsByUserAndProperty(user, property);
        if (!ownsProperty) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        List<Cost> costs = costRepository.findAllByProperty(property);

        BigDecimal earnings = BigDecimal.ZERO;
        BigDecimal expenses = BigDecimal.ZERO;

        for (Cost cost : costs) {
            if (cost.getCostType() == CostType.EARNINGS) {
                earnings = earnings.add(cost.getAmount());
            } else if (cost.getCostType() == CostType.EXPENSES) {
                expenses = expenses.add(cost.getAmount());
            }
        }

        BigDecimal balance = earnings.subtract(expenses);

        CostAccountingRequestDTO dto = new CostAccountingRequestDTO(earnings, expenses, balance);
        
        return ResponseEntity.ok(dto);
    }

    @PostMapping(value = "/add/{propertyId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addCost(@Valid @ModelAttribute AddCostDTO request, @PathVariable Long propertyId) throws IOException{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);

        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);

        if (propertyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found");
        }

        Property property = propertyOpt.get();

        boolean ownsProperty = userPropertyRepository.existsByUserAndProperty(user, property);
        if (!ownsProperty) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        // if (request.document() != null && !request.document().isEmpty()) {
        //     Document document = new Document();
        //     String uploadDir = "uploads/documents/";
        //     Files.createDirectories(Paths.get(uploadDir)); // Crée le dossier si besoin
        //     String uniqueFileName = UUID.randomUUID() + "_" + request.document().getOriginalFilename();
        //     Path filePath = Paths.get(uploadDir, uniqueFileName);
        //     Files.copy(request.document().getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        //     document.setFileName(uploadDir + uniqueFileName);
        // }


        Cost cost = new Cost();
        cost.setProperty(property);
        cost.setAmount(request.amount());
        cost.setCostCategory(request.costCategory());
        cost.setCostType(request.costType());
        cost.setCurrency(request.currency());
        cost.setInvoiceDate(LocalDate.parse(request.date()));
        cost.setLabel(request.label());
        cost.setNotes(request.notes());
        cost.setCreatedAt(Instant.now());
        cost.setUpdatedAt(Instant.now());
        costRepository.save(cost);

        return ResponseEntity.ok().body(Map.of("message", "The cost has been created"));
    }

    @PostMapping("/modify/{id}")
    public ResponseEntity<?> modifyCost(@Valid @RequestBody ModifyCostDTO request, @PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);

        Optional<Cost> costOpt = costRepository.findById(id);

        if (costOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cost not found");
        }

        Cost cost = costOpt.get();

        Property property = cost.getProperty();

        boolean ownsProperty = userPropertyRepository.existsByUserAndProperty(user, property);
        if (!ownsProperty) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        cost.setAmount(request.amount());
        cost.setCostCategory(request.costCategory());
        cost.setCostType(request.costType());
        cost.setCurrency(request.currency());
        cost.setInvoiceDate(LocalDate.parse(request.date()));
        cost.setLabel(request.label());
        cost.setNotes(request.notes());
        cost.setUpdatedAt(Instant.now());
        costRepository.save(cost);

        return ResponseEntity.ok().body(Map.of("message", "The cost has been modified"));
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCost(@PathVariable Long id) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);

        Optional<Cost> costOpt = costRepository.findById(id);

        if (costOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cost not found");
        }

        Cost cost = costOpt.get();

        Property property = cost.getProperty();

        boolean ownsProperty = userPropertyRepository.existsByUserAndProperty(user, property);
        if (!ownsProperty) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        costRepository.delete(cost);

        return ResponseEntity.ok(Map.of("message", "The cost has been deleted"));
    }
}
