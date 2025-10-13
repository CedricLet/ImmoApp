package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.RentInvoiceStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "rent_invoices", indexes = {
        @Index(name = "idx_rent_invoices_lease", columnList = "lease_id"),
        @Index(name = "idx_rent_invoices_status", columnList = "rent_invoice_status")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_rent_invoices_lease_period", columnNames = {"lease_id", "period_year", "period_month"})
})
public class RentInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "lease_id", nullable = false)
    private Lease lease;

    @NotNull
    @Column(name = "period_month", nullable = false)
    private Short periodMonth;

    @NotNull
    @Column(name = "period_year", nullable = false)
    private Short periodYear;

    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @NotNull
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "rent_invoice_status", nullable = false)
    private RentInvoiceStatus rentInvoiceStatus;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}