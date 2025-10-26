package atc.tfe.immoapp.web;

import atc.tfe.immoapp.dto.mapper.DocumentTagDTO;
import atc.tfe.immoapp.repository.DocumentTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/document")
@RequiredArgsConstructor
public class DocumentTagController {
    private final DocumentTagRepository tagRepository;

    @GetMapping("/tags")
    public List<DocumentTagDTO> getAllTags(){
        return tagRepository.findAll().stream()
                .map(t -> new DocumentTagDTO(t.getId(), t.getName()))
                .toList();
    }
}
