package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.City;
import atc.tfe.immoapp.domain.Country;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByNameAndPostalCodeAndCountry(String name, String postalCode, Country country);
 }
