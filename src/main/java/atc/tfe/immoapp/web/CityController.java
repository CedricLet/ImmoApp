package atc.tfe.immoapp.web;

import atc.tfe.immoapp.dto.mapper.CityDTO;
import atc.tfe.immoapp.repositroy.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {
    private final CityRepository cityRepository;

    @GetMapping
    public List<CityDTO> getCities(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size) {
        return cityRepository.findAll(PageRequest.of(page, size))
                .map(c -> new CityDTO(c.getId(), c.getName(), c.getPostalCode(), c.getCountry().getId()))
                .getContent();
    }
}
