package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.Lease;
import atc.tfe.immoapp.domain.Property;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaseRepository extends JpaRepository<Lease, Long> {
    Lease findByProperty(Property property);
}
