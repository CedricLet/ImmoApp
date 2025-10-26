package atc.tfe.immoapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import atc.tfe.immoapp.domain.Cost;
import atc.tfe.immoapp.domain.Property;

public interface CostRepository extends JpaRepository<Cost, Long>  {
    @Query("""
        SELECT c FROM Cost c
        WHERE c.property = :property
        AND (
            LOWER(c.label) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.currency) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(CAST(c.costCategory AS string)) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(CAST(c.costType AS string)) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.notes) LIKE LOWER(CONCAT('%', :search, '%'))
        )
    """)
    Page<Cost> searchCosts(@Param("search") String search, @Param("property") Property property, Pageable pageable);

    @Query("SELECT c FROM Cost c WHERE c.property = :property")
    Page<Cost> findAllByProperty(@Param("property") Property property, Pageable pageable);

    List<Cost> findAllByProperty(Property property);

    void deleteAllByProperty(Property property);
}
