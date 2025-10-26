package atc.tfe.immoapp.dto.mapper;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import atc.tfe.immoapp.enums.CostCategory;
import atc.tfe.immoapp.enums.CostType;
import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddCostDTO(@Nullable MultipartFile document, @NotBlank String label, @NotNull CostCategory costCategory, @NotBlank String currency, @NotNull BigDecimal amount, @NotNull String date, @NotNull CostType costType, @Nullable String notes) {} 
