package com.garrizon.controller;

import com.garrizon.dto.UserDTO;
import com.garrizon.repository.UserRepository;
import com.garrizon.service.MetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin dashboard APIs")
public class AdminController {

    private final MetricsService metricsService;
    private final UserRepository userRepository;

    @GetMapping("/metrics")
    @Operation(summary = "Get dashboard metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(metricsService.getDashboardMetrics());
    }

    @GetMapping("/customers")
    @Operation(summary = "Get all customers")
    public ResponseEntity<Page<UserDTO>> getCustomers(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userRepository.findAll(pageable).map(user -> UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build()));
    }
}
