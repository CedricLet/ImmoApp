package atc.tfe.immoapp.dto.mapper;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import atc.tfe.immoapp.enums.ContextRole;
import atc.tfe.immoapp.enums.PropertyStatus;
import atc.tfe.immoapp.enums.PropertyType;
import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ModifyPropertyDTO (
    @NotBlank String street,
 @NotBlank String postalCode,
 @NotBlank String city,
 @NotNull PropertyType propertyType,
 @NotBlank String label,
 @Nullable MultipartFile image,
 @NotNull PropertyStatus propertyStatus,
 @NotNull ContextRole contextRole,
 BigDecimal surface,
 String notes,
 String pebScore,
 Short yearBuilt)  {
    
}
