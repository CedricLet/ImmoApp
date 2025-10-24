package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.Lease;
import atc.tfe.immoapp.domain.Property;
import atc.tfe.immoapp.enums.LeaseStatus;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaseRepository extends JpaRepository<Lease, Long> {
    Lease findByPropertyAndLeaseStatus(Property property, LeaseStatus leaseStatus);
    List<Lease> findAllByProperty(Property property);
    void deleteAllByProperty(Property property);
}
