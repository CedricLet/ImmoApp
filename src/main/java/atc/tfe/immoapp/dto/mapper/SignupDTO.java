package atc.tfe.immoapp.dto.mapper;

import atc.tfe.immoapp.enums.UserType;
import jakarta.validation.constraints.NotBlank;

public record SignupDTO (@NotBlank String email, @NotBlank String password, @NotBlank String lastname, @NotBlank String firstname, @NotBlank String phone, @NotBlank UserType userType) {}
