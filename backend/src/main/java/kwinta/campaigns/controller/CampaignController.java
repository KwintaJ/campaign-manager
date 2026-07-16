package kwinta.campaigns.controller;

import kwinta.campaigns.dto.CampaignDTO;
import kwinta.campaigns.model.Campaign;
import kwinta.campaigns.service.CampaignService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public List<Campaign> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }

    @PostMapping
    public ResponseEntity<?> createCampaign(@RequestBody CampaignDTO campaignDTO) {
        try {
            Campaign created = campaignService.createCampaign(campaignDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException | IllegalStateException e) {
            // blad trafia do frontendu
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}