package atc.tfe.immoapp.web;

import atc.tfe.immoapp.ai.AiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AiController {
    private final AiService ai;

    public  AiController(AiService ai) {
        this.ai = ai;
    }

    @GetMapping("/ping")
    public String ping(@RequestParam(defaultValue = "Dis bonjour") String q){
        return ai.quickAnswer(q);
    }
}
