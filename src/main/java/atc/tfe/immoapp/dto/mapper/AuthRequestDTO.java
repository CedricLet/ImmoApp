package atc.tfe.immoapp.dto.mapper;

import jakarta.validation.constraints.NotBlank;

public record AuthRequestDTO(@NotBlank String email, @NotBlank String password) {}
