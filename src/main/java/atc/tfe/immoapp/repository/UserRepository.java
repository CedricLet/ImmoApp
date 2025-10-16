package atc.tfe.immoapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import atc.tfe.immoapp.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
