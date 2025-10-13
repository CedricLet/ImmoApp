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
public class DocumentHasTagId implements Serializable {
    @Serial
    private static final long serialVersionUID = -803846904765354481L;
    @NotNull
    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @NotNull
    @Column(name = "document_tag_id", nullable = false)
    private Long documentTagId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        DocumentHasTagId entity = (DocumentHasTagId) o;
        return Objects.equals(this.documentTagId, entity.documentTagId) &&
                Objects.equals(this.documentId, entity.documentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(documentTagId, documentId);
    }

}