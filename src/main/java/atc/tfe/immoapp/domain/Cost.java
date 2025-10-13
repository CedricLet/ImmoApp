package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.CostCategory;
import atc.tfe.immoapp.enums.CostType;
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
@Table(name = "costs", indexes = {
        @Index(name = "idx_costs_property", columnList = "property_id"),
        @Index(name = "idx_costs_invoice_date", columnList = "invoice_date"),
        @Index(name = "idx_costs_category", columnList = "cost_category"),
        @Index(name = "idx_costs_cost_type", columnList = "cost_type")
})
public class Cost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @NotNull
    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Size(max = 120)
    @NotNull
    @Column(name = "label", nullable = false, length = 120)
    private String label;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "cost_category", nullable = false)
    private CostCategory costCategory;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "cost_type", nullable = false)
    private CostType costType;

    @NotNull
    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Size(max = 3)
    @NotNull
    @Column(name = "currency", nullable = false, length = 3, columnDefinition = "CHAR(3)")
    private String currency;

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