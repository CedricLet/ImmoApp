package atc.tfe.immoapp.web;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import atc.tfe.immoapp.domain.Address;
import atc.tfe.immoapp.domain.City;
import atc.tfe.immoapp.domain.Country;
import atc.tfe.immoapp.domain.Property;
import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.domain.UserProperty;
import atc.tfe.immoapp.dto.mapper.PropertyDTO;
import atc.tfe.immoapp.repository.AddressRepository;
import atc.tfe.immoapp.repository.CityRepository;
import atc.tfe.immoapp.repository.CountryRepository;
import atc.tfe.immoapp.repository.PropertyRepository;
import atc.tfe.immoapp.repository.UserPropertyRepository;
import atc.tfe.immoapp.repository.UserRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/property")
public class PropertyController {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;
    private final AddressRepository addressRepository;
    private final UserPropertyRepository userPropertyRepository;


    public PropertyController(PropertyRepository propertyRepository, UserRepository userRepository, CountryRepository countryRepository, CityRepository cityRepository, AddressRepository addressRepository, UserPropertyRepository userPropertyRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
        this.addressRepository = addressRepository;
        this.userPropertyRepository = userPropertyRepository;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProperty(@Valid @ModelAttribute PropertyDTO request) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthenticated");
        }

        String email = authentication.getName(); // name = email
        User user = userRepository.findByEmail(email);


        Country country = countryRepository.findByName("Belgique");

        // Vérifier si la ville existe déjà sinon on la crée
        City city = cityRepository
                .findByNameAndPostalCodeAndCountry(request.city(), request.postalCode(), country)
                .orElseGet(() -> {
                    City newCity = new City();
                    newCity.setCountry(country);
                    newCity.setName(request.city());
                    newCity.setPostalCode(request.postalCode());
                    newCity.setCreatedAt(Instant.now());
                    newCity.setUpdatedAt(Instant.now());
                    return cityRepository.save(newCity);
                });

        Address address = new Address();
        address.setCity(city);
        address.setLine1(request.street());
        address.setCreatedAt(Instant.now());
        address.setUpdatedAt(Instant.now());
        addressRepository.save(address);


        Property property = new Property();
        property.setAddress(address);
        property.setPropertyType(request.propertyType());
        property.setLabel(request.label());
        property.setPropertyStatus(request.propertyStatus());
        property.setSurface(request.surface());
        property.setNotes(request.notes());
        property.setPebScore(request.pebScore());
        property.setYearBuilt(request.yearBuilt());

        String uploadDir = "uploads/property-images/";
        Files.createDirectories(Paths.get(uploadDir)); // Crée le dossier si besoin

        String uniqueFileName = UUID.randomUUID() + "_" + request.image().getOriginalFilename();
        Path filePath = Paths.get(uploadDir, uniqueFileName);

        // Sauvegarder le fichier
        Files.copy(request.image().getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Assigner le chemin dans Property
        property.setImagePath(uploadDir + uniqueFileName);
        property.setCreatedAt(Instant.now());
        property.setUpdatedAt(Instant.now());
        propertyRepository.save(property);

        UserProperty userProperty = new UserProperty();
        userProperty.setProperty(property);
        userProperty.setUser(user);
        userProperty.setActive(true);
        userProperty.setContextRole(request.contextRole());
        userProperty.setAssignedAt(Instant.now());
        userProperty.setCreatedAt(Instant.now());
        userProperty.setUpdatedAt(Instant.now());
        userPropertyRepository.save(userProperty);

        return ResponseEntity.ok(Map.of("message", "The property has been created"));
    }
}
