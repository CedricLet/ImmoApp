package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.Document;
import atc.tfe.immoapp.domain.DocumentHasTag;
import atc.tfe.immoapp.domain.DocumentTag;
import atc.tfe.immoapp.domain.User;
import atc.tfe.immoapp.enums.DocumentCategory;
import atc.tfe.immoapp.enums.UtilityType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public final class DocumentSpecifications {
    private DocumentSpecifications() {}

    public static Specification<Document> byUploader(User u){
        if (u == null) return (r, q, cb) -> cb.disjunction();
        return (r, q, cb) -> cb.equal(r.get("uploadedBy"), u);
    }

    public static Specification<Document> byCategory(DocumentCategory c){
        if (c == null) return null;
        return (r, q, cb) -> cb.equal(r.get("documentCategory"), c);
    }

    public static Specification<Document> byUtility(UtilityType u){
        if (u == null) return null;
        return (r, q, cb) -> cb.equal(r.get("utilityType"), u);
    }

    public static Specification<Document> byPropertyId(Long propertyId){
        if (propertyId == null) return null;
        return (r, q, cb) -> cb.equal(r.get("property").get("id"), propertyId);
    }

    public static Specification<Document> searchTerm(String s){
        if (s == null || s.isBlank()) return null;
        String like = "%" + s.trim().toLowerCase() + "%";
        return (r, q, cb) -> cb.like(cb.lower(r.get("fileName")), like);
    }

    // Documents qui contiennent TOUS les tags demandés (names)
    public static Specification<Document> hasAllTags(List<String> tagNames){
        if (tagNames == null || tagNames.isEmpty()) return null;
        return (r, q, cb) -> {
            Subquery<Long> sq = q.subquery(Long.class);
            Root<DocumentHasTag> dht = sq.from(DocumentHasTag.class);
            Join<DocumentHasTag, DocumentTag> tag = dht.join("documentTag");

            sq.select(cb.countDistinct(tag.get("name")))
                    .where(
                            cb.equal(dht.get("document").get("id"), r.get("id")),
                            tag.get("name").in(tagNames)
                    );
            return cb.equal(sq, (long) tagNames.size());
        };
    }
}
