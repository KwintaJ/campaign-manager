package kwinta.campaigns.dto;

import java.math.BigDecimal;
import java.util.Set;

import lombok.*;

@Getter
@Setter
public class CampaignDTO {
    private Long        id;
    private String      name;
    private Set<Long>   keywordIds;     // tylko ID keywordow
    private BigDecimal  bidAmount;
    private BigDecimal  campaignFund;
    private String      status;         // "ON" / "OFF"
    private Long        townId;         // tylko ID miasta
    private Integer     radius;
}