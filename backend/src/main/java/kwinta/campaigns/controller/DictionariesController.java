package kwinta.campaigns.controller;

import kwinta.campaigns.model.Keyword;
import kwinta.campaigns.model.Town;
import kwinta.campaigns.repository.KeywordRepository;
import kwinta.campaigns.repository.TownRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// kontroler do get-all z gory ustalonych slownikow: keywords i miasta
// kazdy get wykonywany w React raz przy zaladowaniu aplikacji
@RestController
@RequestMapping("/api")
public class DictionariesController {

    private final TownRepository townRepository;
    private final KeywordRepository keywordRepository;

    public DictionariesController(TownRepository townRepository, KeywordRepository keywordRepository) {
        this.townRepository = townRepository;
        this.keywordRepository = keywordRepository;
    }

    @GetMapping("/towns")
    public List<Town> getAllTowns() {
        return townRepository.findAll();
    }

    @GetMapping("/keywords")
    public List<Keyword> getAllKeywords() {
        return keywordRepository.findAll();
    }
}