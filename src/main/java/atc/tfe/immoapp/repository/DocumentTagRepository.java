package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.DocumentTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentTagRepository extends JpaRepository<DocumentTag, Long> {
    Optional<DocumentTag> findByName(String name);
    List<DocumentTag> findByNameIn(Iterable<String> names);
}
