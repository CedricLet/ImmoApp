package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.UtilityType;
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
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "energy_consumptions", indexes = {
        @Index(name = "idx_energy_cons_property", columnList = "property_id"),
        @Index(name = "idx_energy_cons_type_period", columnList = "utility_type, period_start, period_end")
})
public class EnergyConsumption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "utility_type", nullable = false)
    private UtilityType utilityType;

    @NotNull
    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;

    @NotNull
    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;

    @NotNull
    @Column(name = "index_start", nullable = false, precision = 12, scale = 3)
    private BigDecimal indexStart;

    @NotNull
    @Column(name = "index_end", nullable = false, precision = 12, scale = 3)
    private BigDecimal indexEnd;

    @Size(max = 10)
    @NotNull
    @Column(name = "unit", nullable = false, length = 10)
    private String unit;

    @Column(name = "unit_price", precision = 10, scale = 4)
    private BigDecimal unitPrice;

    @Column(name = "computed_cost", precision = 12, scale = 2)
    private BigDecimal computedCost;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}