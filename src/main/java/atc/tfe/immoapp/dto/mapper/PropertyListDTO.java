package atc.tfe.immoapp.dto.mapper;

import atc.tfe.immoapp.enums.PropertyType;

public record PropertyListDTO (Long id, PropertyType propertyType, String label, String city, String imagePath) {}
