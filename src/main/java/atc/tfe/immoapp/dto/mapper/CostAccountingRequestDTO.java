package atc.tfe.immoapp.dto.mapper;

import java.math.BigDecimal;

public record CostAccountingRequestDTO(BigDecimal earnings, BigDecimal expenses, BigDecimal balance) {}