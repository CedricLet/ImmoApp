package atc.tfe.immoapp.dto.mapper;

import jakarta.validation.constraints.NotBlank;

public record ModifyUserDTO (@NotBlank String lastname, @NotBlank String firstname, @NotBlank String phone) {}
