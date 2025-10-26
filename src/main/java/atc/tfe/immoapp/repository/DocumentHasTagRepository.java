package atc.tfe.immoapp.repository;

import atc.tfe.immoapp.domain.DocumentHasTag;
import atc.tfe.immoapp.domain.DocumentHasTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface DocumentHasTagRepository extends JpaRepository<DocumentHasTag, DocumentHasTagId> {
    @Modifying
    @Query("delete from DocumentHasTag d where d.document.id = :documentId")
    void deleteByDocumentId(Long documentId);

    @Query("select d.document.id as docId, t.name as name " +
            "from DocumentHasTag d join d.documentTag t " +
            "where d.document.id in :documentIds")
    List<Object[]> findTagNamesByDocumentIds(Collection<Long> documentIds);
}
