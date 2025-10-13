package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.ContextRole;
import jakarta.persistence.*;
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
public class UserPropertyId implements Serializable {
    @Serial
    private static final long serialVersionUID = -8216769924170945171L;
    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "context_role", nullable = false)
    private ContextRole contextRole;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UserPropertyId entity = (UserPropertyId) o;
        return Objects.equals(this.contextRole, entity.contextRole) &&
                Objects.equals(this.userId, entity.userId) &&
                Objects.equals(this.propertyId, entity.propertyId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(contextRole, userId, propertyId);
    }

}