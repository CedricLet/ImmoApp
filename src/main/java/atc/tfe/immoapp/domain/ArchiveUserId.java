package atc.tfe.immoapp.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ArchiveUserId implements Serializable {
    @Serial
    private static final long serialVersionUID = -5376252338361794434L;
    @NotNull
    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ArchiveUserId entity = (ArchiveUserId) o;
        return Objects.equals(this.documentId, entity.documentId) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(documentId, userId);
    }

}