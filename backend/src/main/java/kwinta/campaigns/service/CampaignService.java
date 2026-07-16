package kwinta.campaigns.service;

import kwinta.campaigns.dto.CampaignDTO;
import kwinta.campaigns.model.Campaign;
import kwinta.campaigns.model.EmeraldAccount;
import kwinta.campaigns.model.Keyword;
import kwinta.campaigns.model.Town;
import kwinta.campaigns.repository.CampaignRepository;
import kwinta.campaigns.repository.EmeraldAccountRepository;
import kwinta.campaigns.repository.KeywordRepository;
import kwinta.campaigns.repository.TownRepository;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final EmeraldAccountRepository accountRepository;
    private final TownRepository townRepository;
    private final KeywordRepository keywordRepository;

    public CampaignService(CampaignRepository c, EmeraldAccountRepository a, TownRepository t, KeywordRepository k) {
        this.campaignRepository = c;
        this.accountRepository = a;
        this.townRepository = t;
        this.keywordRepository = k;
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public Campaign getCampaignById(Long id) {
        // walidacja id
        return campaignRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nie istnieje kampania o ID=" + id));
    }

    @Transactional
    public Campaign createCampaign(CampaignDTO dto) {
        // walidacja czy jakies keywords sa
        if (dto.getKeywordIds() == null || dto.getKeywordIds().isEmpty()) {
            throw new IllegalArgumentException("Kampania musi mieć przypisane co najmniej jedno słowo kluczowe!");
        }

        // portfel (zakladamy, ze istnieje tylko jedno EmeraldAccount ID = 1)
        EmeraldAccount account = accountRepository.findById(1L)
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono konta!"));

        // walidacja srodkow w portfelu
        if (account.getBalance().compareTo(dto.getCampaignFund()) < 0) {
            throw new IllegalArgumentException("Niewystarczające środki na koncie!");
        }

        // walidacja miasta i pobranie z bazy
        Town town = townRepository.findById(dto.getTownId())
                .orElseThrow(() -> new IllegalArgumentException("Wybrane miasto nie istnieje!"));

        // walidacja i pobranie keywordow
        Set<Keyword> keywords = new HashSet<>(keywordRepository.findAllById(dto.getKeywordIds()));
        if (keywords.size() != dto.getKeywordIds().size()) {
            throw new IllegalArgumentException("Niektóre z wybranych słów kluczowych nie istnieją!");
        }

        // obnizenie stanu portfela o budzet kampanii 
        account.setBalance(account.getBalance().subtract(dto.getCampaignFund()));
        accountRepository.save(account);

        // stworzenie obiektu Campaign i zapis do bazy
        Campaign campaign = new Campaign();
        campaign.setName(dto.getName());
        campaign.setKeywords(keywords);
        campaign.setBidAmount(dto.getBidAmount());
        campaign.setCampaignFund(dto.getCampaignFund());
        campaign.setStatus(dto.getStatus() != null ? dto.getStatus() : "OFF"); // domyslnie "OFF"
        campaign.setTown(town);
        campaign.setRadius(dto.getRadius());

        return campaignRepository.save(campaign);
    }

    @Transactional
    public Campaign updateCampaign(Long id, CampaignDTO dto) {
        // walidacja id
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nie istnieje kampania o ID=" + id));

        // walidacja czy jakies keywords sa
        if (dto.getKeywordIds() == null || dto.getKeywordIds().isEmpty()) {
            throw new IllegalArgumentException("Kampania musi mieć przypisane co najmniej jedno słowo kluczowe!");
        }

        // obsluga roznicy w budzetach
        BigDecimal oldFund = campaign.getCampaignFund();
        BigDecimal newFund = dto.getCampaignFund();
        BigDecimal fundDifference = newFund.subtract(oldFund); // + zabieramy z portfela, - = zwracamy

        EmeraldAccount account = accountRepository.findById(1L)
                .orElseThrow(() -> new IllegalStateException("Nie znaleziono konta!"));

        if (fundDifference.compareTo(BigDecimal.ZERO) > 0) {
            // przy wiekszym budzecie sprawdzamy czy stac
            if (account.getBalance().compareTo(fundDifference) < 0) {
                throw new IllegalArgumentException("Niewystarczające środki na koncie!");
            }
            account.setBalance(account.getBalance().subtract(fundDifference));
        } else if (fundDifference.compareTo(BigDecimal.ZERO) < 0) {
            account.setBalance(account.getBalance().add(fundDifference.abs()));
        }
        accountRepository.save(account);

        // walidacja miasta i pobranie z bazy
        Town town = townRepository.findById(dto.getTownId())
                .orElseThrow(() -> new IllegalArgumentException("Wybrane miasto nie istnieje!"));
        
        // walidacja i pobranie keywordow
        Set<Keyword> keywords = new HashSet<>(keywordRepository.findAllById(dto.getKeywordIds()));
        if (keywords.size() != dto.getKeywordIds().size()) {
            throw new IllegalArgumentException("Niektóre z wybranych słów kluczowych nie istnieją!");
        }

        // aktualizacja na obiekcie i zapis do bazy
        campaign.setName(dto.getName());
        campaign.setBidAmount(dto.getBidAmount());
        campaign.setCampaignFund(dto.getCampaignFund());
        campaign.setStatus(dto.getStatus() != null ? dto.getStatus() : "OFF");
        campaign.setRadius(dto.getRadius());
        campaign.setTown(town);
        campaign.setKeywords(keywords);

        return campaignRepository.save(campaign);
    }

    @Transactional
    public void deleteCampaign(Long id) {
        // walidacja id
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nie istnieje kampania o ID=" + id));

        // zwrocenie budzetu przy usuwaniu
        EmeraldAccount account = accountRepository.findById(1L).orElseThrow(() -> new IllegalStateException("Nie znaleziono konta!"));
        
        account.setBalance(account.getBalance().add(campaign.getCampaignFund()));
        accountRepository.save(account);

        // delete na bazie danych
        campaignRepository.delete(campaign);
    }
}