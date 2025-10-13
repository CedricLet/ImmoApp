package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.PropertyStatus;
import atc.tfe.immoapp.enums.PropertyType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "properties", indexes = {
        @Index(name = "idx_properties_address", columnList = "address_id"),
        @Index(name = "idx_properties_syndic", columnList = "syndic_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_properties_address_unit", columnNames = {"address_id", "unit_label"})
})
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "syndic_id")
    private Syndic syndic;

    @Size(max = 120)
    @NotNull
    @Column(name = "label", nullable = false, length = 120)
    private String label;

    @Size(max = 50)
    @Column(name = "unit_label", length = 50)
    private String unitLabel;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType;

    @Column(name = "year_built")
    private Short yearBuilt;

    @Column(name = "surface", precision = 8, scale = 2)
    private BigDecimal surface;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "property_status", nullable = false)
    private PropertyStatus propertyStatus;

    @Size(max = 5)
    @Column(name = "peb_score", length = 5)
    private String pebScore;

    @Size(max = 500)
    @Column(name = "image_path", length = 500)
    private String imagePath;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}