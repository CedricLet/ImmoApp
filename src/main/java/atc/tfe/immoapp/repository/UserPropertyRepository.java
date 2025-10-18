package atc.tfe.immoapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import atc.tfe.immoapp.domain.UserProperty;

public interface UserPropertyRepository extends JpaRepository<UserProperty, Long> {

 }
