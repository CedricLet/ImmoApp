package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> { }
