package atc.tfe.immoapp.web;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import atc.tfe.immoapp.domain.Lease;
import atc.tfe.immoapp.domain.Property;
import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.dto.mapper.AddLeaseDTO;
import atc.tfe.immoapp.dto.mapper.LeaseInfoResponseDTO;
import atc.tfe.immoapp.dto.mapper.ModifyPropertyDTO;
import atc.tfe.immoapp.enums.LeaseStatus;
import atc.tfe.immoapp.enums.PropertyStatus;
import atc.tfe.immoapp.repository.AddressRepository;
import atc.tfe.immoapp.repository.CityRepository;
import atc.tfe.immoapp.repository.CountryRepository;
import atc.tfe.immoapp.repository.LeaseRepository;
import atc.tfe.immoapp.repository.PropertyRepository;
import atc.tfe.immoapp.repository.UserPropertyRepository;
import atc.tfe.immoapp.repository.UserRepository;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/lease")
public class LeaseController {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;
    private final AddressRepository addressRepository;
    private final UserPropertyRepository userPropertyRepository;
    private final LeaseRepository leaseRepository;


    public LeaseController(PropertyRepository propertyRepository, UserRepository userRepository, CountryRepository countryRepository, CityRepository cityRepository, AddressRepository addressRepository, UserPropertyRepository userPropertyRepository, LeaseRepository leaseRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
        this.addressRepository = addressRepository;
        this.userPropertyRepository = userPropertyRepository;
        this.leaseRepository = leaseRepository;
    }

    @PostMapping("/add/{propertyId}")
    public ResponseEntity<?> addLease(@Valid @RequestBody AddLeaseDTO request, @PathVariable Long propertyId) {
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

        Lease lease = new Lease();
        lease.setProperty(property);
        lease.setTenantFullName(request.fullName());
        lease.setTenantEmail(request.email());
        lease.setTenantPhone(request.phone());
        lease.setRentAmount(request.rentAmount());
        lease.setPaymentDay(request.paymentDay());
        lease.setStartDate(LocalDate.parse(request.startDate()));
        lease.setEndDate(LocalDate.parse(request.endDate()));
        lease.setLeaseStatus(LeaseStatus.ACTIVE);
        lease.setDepositAmount(request.depositAmount());
        lease.setTenantNotes(request.notes());
        lease.setCreatedAt(Instant.now());
        lease.setUpdatedAt(Instant.now());
        leaseRepository.save(lease);

        property.setPropertyStatus(PropertyStatus.RENTED);
        property.setUpdatedAt(Instant.now());
        propertyRepository.save(property);

        return ResponseEntity.ok().body(Map.of("message", "The lease has been created"));
    }

    @PostMapping("/modify/{propertyId}")
    public ResponseEntity<?> modifyLease(@Valid @RequestBody AddLeaseDTO request, @PathVariable Long propertyId) {
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

        Lease lease = leaseRepository.findByPropertyAndLeaseStatus(property, LeaseStatus.ACTIVE);
        lease.setTenantFullName(request.fullName());
        lease.setTenantEmail(request.email());
        lease.setTenantPhone(request.phone());
        lease.setRentAmount(request.rentAmount());
        lease.setPaymentDay(request.paymentDay());
        lease.setStartDate(LocalDate.parse(request.startDate()));
        lease.setEndDate(LocalDate.parse(request.endDate()));
        lease.setDepositAmount(request.depositAmount());
        lease.setTenantNotes(request.notes());
        lease.setUpdatedAt(Instant.now());
        leaseRepository.save(lease);

        return ResponseEntity.ok(Map.of("message", "The lease has been modified"));
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<?> getLease(@PathVariable Long propertyId) {
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

        Lease lease = leaseRepository.findByPropertyAndLeaseStatus(property, LeaseStatus.ACTIVE);

        LeaseInfoResponseDTO dto = new LeaseInfoResponseDTO(
            lease.getId(),
            lease.getTenantFullName(),
            lease.getTenantEmail(),
            lease.getTenantPhone(),
            lease.getRentAmount(),
            lease.getPaymentDay(),
            lease.getDepositAmount(),
            lease.getTenantNotes(),
            lease.getStartDate().toString(),
            lease.getEndDate().toString()
        );

        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/close/{propertyId}")
    public ResponseEntity<?> closeLease(@PathVariable Long propertyId) {
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

        Lease lease = leaseRepository.findByPropertyAndLeaseStatus(property, LeaseStatus.ACTIVE);

        lease.setLeaseStatus(LeaseStatus.ENDED);
        lease.setUpdatedAt(Instant.now());
        leaseRepository.save(lease);

        property.setPropertyStatus(PropertyStatus.FOR_RENT);
        property.setUpdatedAt(Instant.now());
        propertyRepository.save(property);

        return ResponseEntity.ok(Map.of("message", "The lease has been closed"));
    }
}
