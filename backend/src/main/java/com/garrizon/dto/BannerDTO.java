package com.garrizon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerDTO {

    private Long id;

    // Banner content
    private String title;
    private String subtitle;
    private String description;

    // Call to action
    private String ctaText;
    private String ctaLink;

    // Image
    private String imageUrl;
    private String mobileImageUrl;

    // Display settings
    private Integer displayOrder;
    private Boolean isActive;

    // Scheduling
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // Target audience
    private String targetAudience;

    // Metadata
    private Long createdBy;
    private String createdByName;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
