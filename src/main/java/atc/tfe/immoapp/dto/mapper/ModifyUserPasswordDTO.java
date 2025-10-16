package atc.tfe.immoapp.dto.mapper;

import jakarta.validation.constraints.NotBlank;

public record ModifyUserPasswordDTO(@NotBlank String newPassword, @NotBlank String validateNewPassword) {}
