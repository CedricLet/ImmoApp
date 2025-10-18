package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.Address;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {

 }
