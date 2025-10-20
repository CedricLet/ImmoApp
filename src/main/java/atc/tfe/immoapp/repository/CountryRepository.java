package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.Country;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Long> {
    Country findByName(String name);
 }
