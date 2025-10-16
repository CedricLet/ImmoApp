package atc.tfe.immoapp.dto.mapper;

import atc.tfe.immoapp.enums.UserType;

public record UserDTO(
        String lastname,
        String firstname,
        String email,
        String phone,
        UserType userType
) {}
