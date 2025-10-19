package atc.tfe.immoapp.dto.mapper;

import java.math.BigDecimal;

import atc.tfe.immoapp.enums.ContextRole;
import atc.tfe.immoapp.enums.PropertyStatus;
import atc.tfe.immoapp.enums.PropertyType;

public record PropertyInfoResponse (
 String imagePath,
 String label,
 PropertyType propertyType,
 PropertyStatus propertyStatus,
 String street,
 String postalCode,
 String city,
 String country,
 ContextRole contextRole,
 Short yearBuilt,
 BigDecimal surface,
 String pebScore,
 String notes
 ) {}
