package atc.tfe.immoapp.dto.mapper;

import atc.tfe.immoapp.enums.UserType;
import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SignupDTO (@NotBlank String email, @NotBlank String password, @NotBlank String lastname, @NotBlank String firstname, @Nullable String phone, @NotNull UserType userType) {}
