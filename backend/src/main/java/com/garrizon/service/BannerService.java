package com.garrizon.service;

import com.garrizon.dto.BannerDTO;
import com.garrizon.exception.ResourceNotFoundException;
import com.garrizon.model.Banner;
import com.garrizon.model.Banner.TargetAudience;
import com.garrizon.model.User;
import com.garrizon.repository.BannerRepository;
import com.garrizon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<BannerDTO> getAllBanners() {
        List<Banner> banners = bannerRepository.findAllByOrderByDisplayOrderAsc();
        return banners.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BannerDTO> getActiveBanners() {
        List<Banner> banners = bannerRepository.findActiveBanners(LocalDateTime.now());
        return banners.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BannerDTO getBannerById(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));
        return mapToDTO(banner);
    }

    @Transactional
    public BannerDTO createBanner(BannerDTO bannerDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Banner banner = Banner.builder()
                .title(bannerDTO.getTitle())
                .subtitle(bannerDTO.getSubtitle())
                .description(bannerDTO.getDescription())
                .ctaText(bannerDTO.getCtaText())
                .ctaLink(bannerDTO.getCtaLink())
                .imageUrl(bannerDTO.getImageUrl())
                .mobileImageUrl(bannerDTO.getMobileImageUrl())
                .displayOrder(bannerDTO.getDisplayOrder() != null ? bannerDTO.getDisplayOrder() : 0)
                .isActive(bannerDTO.getIsActive() != null ? bannerDTO.getIsActive() : true)
                .startDate(bannerDTO.getStartDate())
                .endDate(bannerDTO.getEndDate())
                .targetAudience(
                        bannerDTO.getTargetAudience() != null ? TargetAudience.valueOf(bannerDTO.getTargetAudience())
                                : TargetAudience.ALL)
                .createdBy(user)
                .build();

        Banner savedBanner = bannerRepository.save(banner);
        return mapToDTO(savedBanner);
    }

    @Transactional
    public BannerDTO updateBanner(Long id, BannerDTO bannerDTO) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));

        banner.setTitle(bannerDTO.getTitle());
        banner.setSubtitle(bannerDTO.getSubtitle());
        banner.setDescription(bannerDTO.getDescription());
        banner.setCtaText(bannerDTO.getCtaText());
        banner.setCtaLink(bannerDTO.getCtaLink());
        banner.setImageUrl(bannerDTO.getImageUrl());
        banner.setMobileImageUrl(bannerDTO.getMobileImageUrl());
        banner.setDisplayOrder(bannerDTO.getDisplayOrder());
        banner.setIsActive(bannerDTO.getIsActive());
        banner.setStartDate(bannerDTO.getStartDate());
        banner.setEndDate(bannerDTO.getEndDate());

        if (bannerDTO.getTargetAudience() != null) {
            banner.setTargetAudience(TargetAudience.valueOf(bannerDTO.getTargetAudience()));
        }

        Banner updatedBanner = bannerRepository.save(banner);
        return mapToDTO(updatedBanner);
    }

    @Transactional
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));
        bannerRepository.delete(banner);
    }

    @Transactional
    public BannerDTO toggleBannerStatus(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));

        banner.setIsActive(!banner.getIsActive());
        Banner updatedBanner = bannerRepository.save(banner);
        return mapToDTO(updatedBanner);
    }

    // Mapping method
    private BannerDTO mapToDTO(Banner banner) {
        return BannerDTO.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .subtitle(banner.getSubtitle())
                .description(banner.getDescription())
                .ctaText(banner.getCtaText())
                .ctaLink(banner.getCtaLink())
                .imageUrl(banner.getImageUrl())
                .mobileImageUrl(banner.getMobileImageUrl())
                .displayOrder(banner.getDisplayOrder())
                .isActive(banner.getIsActive())
                .startDate(banner.getStartDate())
                .endDate(banner.getEndDate())
                .targetAudience(banner.getTargetAudience().name())
                .createdBy(banner.getCreatedBy().getId())
                .createdByName(banner.getCreatedBy().getFirstName() + " " + banner.getCreatedBy().getLastName())
                .createdAt(banner.getCreatedAt())
                .updatedAt(banner.getUpdatedAt())
                .build();
    }
}
