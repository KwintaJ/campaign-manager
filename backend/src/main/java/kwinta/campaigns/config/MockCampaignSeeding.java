package kwinta.campaigns.config;

import kwinta.campaigns.dto.CampaignDTO;
import kwinta.campaigns.service.CampaignService;

import java.math.BigDecimal;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MockCampaignSeeding implements CommandLineRunner {

    private final CampaignService campaignService;

    public MockCampaignSeeding(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @Override
    public void run(String... args) throws Exception {
        createMockCampaign("Wyprzedaż używanych samochodów", 1L, 28, "ON", new BigDecimal("4.0"), new BigDecimal("2000.0"), Set.of(2L));
        createMockCampaign("Antykwariat - książki, antyki, starocie", 2L, 10, "ON", new BigDecimal("2.5"), new BigDecimal("300.0"), Set.of(7L));
        createMockCampaign("[ZAKOŃCZONA] Kampania promocyjna Super-Zabawki", 3L, 45, "OFF", new BigDecimal("1.2"), new BigDecimal("200.0"), Set.of(5L));
    }

    private void createMockCampaign(String name, Long townId, int radius, String status, BigDecimal bid, BigDecimal fund, Set<Long> keywordIds) {
        CampaignDTO dto = new CampaignDTO();
        dto.setName(name);
        dto.setTownId(townId);
        dto.setRadius(radius);
        dto.setStatus(status);
        dto.setBidAmount(bid);
        dto.setCampaignFund(fund);
        dto.setKeywordIds(keywordIds);

        try {
            campaignService.createCampaign(dto);
        } catch (Exception e) {
            System.err.println("Nie udało się utworzyć kampanii: " + e.getMessage());
        }
    }
}