package atc.tfe.immoapp.dto.mapper;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotBlank;

public record ModifyUserDTO (@NotBlank String lastname, @NotBlank String firstname, @Nullable String phone) {}
