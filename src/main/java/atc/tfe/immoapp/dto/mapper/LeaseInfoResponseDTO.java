package atc.tfe.immoapp.dto.mapper;

import java.math.BigDecimal;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LeaseInfoResponseDTO(@NotNull Long id, @NotBlank String fullName, @NotBlank String email, @NotBlank String phone, @NotNull BigDecimal rentAmount, @NotNull Short paymentDay, @NotNull BigDecimal depositAmount, @Nullable String notes, @NotNull String startDate, @NotNull String endDate) {}
