package atc.tfe.immoapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import atc.tfe.immoapp.domain.Property;
import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.domain.UserProperty;

public interface UserPropertyRepository extends JpaRepository<UserProperty, Long> {
   boolean existsByUserAndProperty(User user, Property property);
   UserProperty findByUserAndProperty(User user, Property property);
 }
