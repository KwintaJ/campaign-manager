package kwinta.campaigns.config;

import kwinta.campaigns.model.EmeraldAccount;
import kwinta.campaigns.model.Keyword;
import kwinta.campaigns.model.Town;
import kwinta.campaigns.repository.EmeraldAccountRepository;
import kwinta.campaigns.repository.KeywordRepository;
import kwinta.campaigns.repository.TownRepository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.core.annotation.Order;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DataSeeding implements CommandLineRunner {

    private final TownRepository townRepository;
    private final KeywordRepository keywordRepository;
    private final EmeraldAccountRepository accountRepository;

    public DataSeeding(TownRepository t, KeywordRepository k, EmeraldAccountRepository a) {
        this.townRepository = t;
        this.keywordRepository = k;
        this.accountRepository = a;
    }

    @Override
    public void run(String... args) throws Exception {
        if (townRepository.count() == 0) {
            List<Town> towns = List.of(
                new Town("Warszawa"),
                new Town("Kraków"),
                new Town("Wrocław"),
                new Town("Poznań"),
                new Town("Gdańsk"),
                new Town("Katowice")
            );
            townRepository.saveAll(towns);
        }

        if (keywordRepository.count() == 0) {
            List<Keyword> keywords = List.of(
                new Keyword("Elektronika"),
                new Keyword("Motoryzacja"),
                new Keyword("Moda"),
                new Keyword("Dom i ogród"),
                new Keyword("Dla dzieci"),
                new Keyword("Sport"),
                new Keyword("Książki i edukacja"),
                new Keyword("Usługi")
            );
            keywordRepository.saveAll(keywords);
        }

        if (accountRepository.count() == 0) {
            EmeraldAccount account = new EmeraldAccount(new BigDecimal("5000.00"));
            accountRepository.save(account);
        }
    }
}