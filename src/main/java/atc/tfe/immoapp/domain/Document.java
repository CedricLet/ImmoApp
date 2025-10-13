package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.DocumentCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "documents", indexes = {
        @Index(name = "idx_documents_category", columnList = "document_category"),
        @Index(name = "idx_documents_uploaded_by", columnList = "uploaded_by"),
        @Index(name = "idx_documents_property", columnList = "property_id"),
        @Index(name = "idx_documents_lease", columnList = "lease_id"),
        @Index(name = "idx_documents_syndic_report", columnList = "syndic_report_id"),
        @Index(name = "idx_documents_cost", columnList = "cost_id")
})
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Size(max = 100)
    @NotNull
    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @NotNull
    @Column(name = "size_bytes", nullable = false)
    private Long sizeBytes;

    @Size(max = 64)
    @Column(name = "checksum", length = 64)
    private String checksum;

    @Size(max = 500)
    @NotNull
    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "document_category", nullable = false)
    private DocumentCategory documentCategory;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "lease_id")
    private Lease lease;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "syndic_report_id")
    private SyndicReport syndicReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "cost_id")
    private Cost cost;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}