package atc.tfe.immoapp.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import atc.tfe.immoapp.domain.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    
}
