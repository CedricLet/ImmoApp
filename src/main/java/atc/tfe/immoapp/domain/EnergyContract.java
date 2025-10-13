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

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "energy_contracts", indexes = {
        @Index(name = "idx_energy_contracts_property", columnList = "property_id"),
        @Index(name = "idx_energy_contracts_provider", columnList = "provider_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_energy_contracts_ref", columnNames = {"property_id", "utility_type", "contract_no"})
})
public class EnergyContract {
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
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "utility_type", nullable = false)
    private UtilityType utilityType;

    @Size(max = 80)
    @NotNull
    @Column(name = "contract_no", nullable = false, length = 80)
    private String contractNo;

    @Size(max = 120)
    @Column(name = "plan_name", length = 120)
    private String planName;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "auto_renew", nullable = false)
    private Boolean autoRenew = false;

    @Size(max = 3)
    @NotNull
    @Column(name = "currency", nullable = false, length = 3, columnDefinition = "CHAR(3)")
    private String currency;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}