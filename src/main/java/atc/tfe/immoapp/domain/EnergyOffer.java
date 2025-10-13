package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.UtilityType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "energy_offers", indexes = {
        @Index(name = "idx_energy_offers_provider", columnList = "provider_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_energy_offers_provider_plan_util", columnNames = {"provider_id", "plan_name", "utility_type"})
})
public class EnergyOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;

    @Size(max = 120)
    @NotNull
    @Column(name = "plan_name", nullable = false, length = 120)
    private String planName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "utility_type", nullable = false)
    private UtilityType utilityType;

    @NotNull
    @ColumnDefault("0.00")
    @Column(name = "fixed_fee_year", nullable = false, precision = 10, scale = 2)
    private BigDecimal fixedFeeYear;

    @Column(name = "variable_price_per_kwh", precision = 10, scale = 4)
    private BigDecimal variablePricePerKwh;

    @Size(max = 3)
    @NotNull
    @Column(name = "currency", nullable = false, length = 3, columnDefinition = "CHAR(3)")
    private String currency;

    @NotNull
    @Column(name = "last_updated", nullable = false)
    private LocalDate lastUpdated;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}