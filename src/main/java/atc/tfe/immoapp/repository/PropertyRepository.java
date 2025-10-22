package atc.tfe.immoapp.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import atc.tfe.immoapp.domain.Property;
import atc.tfe.immoapp.domain.User;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    @Query("SELECT p FROM Property p " +
       "JOIN UserProperty up ON up.property = p " +
       "WHERE up.user = :user AND (" +
       "LOWER(p.label) LIKE LOWER(CONCAT('%', :search, '%')) " +
       "OR LOWER(p.address.city.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
       "OR LOWER(CAST(p.propertyType AS STRING)) LIKE LOWER(CONCAT('%', :search, '%'))" +
       ")")
    Page<Property> searchProperties(@Param("search") String search, @Param("user") User user, Pageable pageable);

    @Query("SELECT p FROM Property p " +
    "JOIN UserProperty up ON up.property = p " +
    "WHERE up.user = :user")
    Page<Property> findAllByUser(@Param("user") User user, Pageable pageable);

}
