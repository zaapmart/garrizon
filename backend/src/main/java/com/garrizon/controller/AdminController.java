package com.garrizon.controller;

import com.garrizon.dto.*;
import com.garrizon.model.Order.OrderStatus;
import com.garrizon.model.Order.PaymentStatus;
import com.garrizon.model.Transaction.TransactionStatus;
import com.garrizon.repository.UserRepository;
import com.garrizon.security.JwtTokenProvider;
import com.garrizon.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin dashboard APIs")
public class AdminController {

    private final MetricsService metricsService;
    private final DashboardService dashboardService;
    private final OrderService orderService;
    private final TransactionService transactionService;
    private final BannerService bannerService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // ==================== Dashboard ====================

    @GetMapping("/metrics")
    @Operation(summary = "Get dashboard metrics (legacy)")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(metricsService.getDashboardMetrics());
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get comprehensive dashboard statistics")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/dashboard/recent-orders")
    @Operation(summary = "Get recent orders for dashboard")
    public ResponseEntity<List<OrderDTO>> getRecentOrders() {
        List<OrderDTO> orders = orderService.getRecentOrders();
        return ResponseEntity.ok(orders);
    }

    // ==================== Orders ====================

    @GetMapping("/orders")
    @Operation(summary = "Get all orders with filters")
    public ResponseEntity<Page<OrderDTO>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<OrderDTO> orders = orderService.getAllOrders(status, paymentStatus, search, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        OrderDTO order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        OrderStatus status = OrderStatus.valueOf(request.get("status"));
        OrderDTO order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{id}/payment-status")
    @Operation(summary = "Update order payment status")
    public ResponseEntity<OrderDTO> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        PaymentStatus paymentStatus = PaymentStatus.valueOf(request.get("paymentStatus"));
        OrderDTO order = orderService.updatePaymentStatus(id, paymentStatus);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{id}/notes")
    @Operation(summary = "Add admin notes to order")
    public ResponseEntity<OrderDTO> addAdminNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        OrderDTO order = orderService.addAdminNotes(id, request.get("notes"));
        return ResponseEntity.ok(order);
    }

    // ==================== Transactions ====================

    @GetMapping("/transactions")
    @Operation(summary = "Get all transactions with filters")
    public ResponseEntity<Page<TransactionDTO>> getTransactions(
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<TransactionDTO> transactions = transactionService.getAllTransactions(status, search, pageable);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/{id}")
    @Operation(summary = "Get transaction by ID")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        TransactionDTO transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/reference/{reference}")
    @Operation(summary = "Get transaction by reference")
    public ResponseEntity<TransactionDTO> getTransactionByReference(@PathVariable String reference) {
        TransactionDTO transaction = transactionService.getTransactionByReference(reference);
        return ResponseEntity.ok(transaction);
    }

    // ==================== Banners ====================

    @GetMapping("/banners")
    @Operation(summary = "Get all banners")
    public ResponseEntity<List<BannerDTO>> getAllBanners() {
        List<BannerDTO> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(banners);
    }

    @GetMapping("/banners/active")
    @Operation(summary = "Get active banners")
    public ResponseEntity<List<BannerDTO>> getActiveBanners() {
        List<BannerDTO> banners = bannerService.getActiveBanners();
        return ResponseEntity.ok(banners);
    }

    @GetMapping("/banners/{id}")
    @Operation(summary = "Get banner by ID")
    public ResponseEntity<BannerDTO> getBannerById(@PathVariable Long id) {
        BannerDTO banner = bannerService.getBannerById(id);
        return ResponseEntity.ok(banner);
    }

    @PostMapping("/banners")
    @Operation(summary = "Create new banner")
    public ResponseEntity<BannerDTO> createBanner(
            @RequestBody BannerDTO bannerDTO,
            HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        BannerDTO banner = bannerService.createBanner(bannerDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(banner);
    }

    @PutMapping("/banners/{id}")
    @Operation(summary = "Update banner")
    public ResponseEntity<BannerDTO> updateBanner(
            @PathVariable Long id,
            @RequestBody BannerDTO bannerDTO) {
        BannerDTO banner = bannerService.updateBanner(id, bannerDTO);
        return ResponseEntity.ok(banner);
    }

    @DeleteMapping("/banners/{id}")
    @Operation(summary = "Delete banner")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/banners/{id}/toggle")
    @Operation(summary = "Toggle banner active status")
    public ResponseEntity<BannerDTO> toggleBannerStatus(@PathVariable Long id) {
        BannerDTO banner = bannerService.toggleBannerStatus(id);
        return ResponseEntity.ok(banner);
    }

    // ==================== Customers ====================

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

    // ==================== Helper Methods ====================

    private Long getUserIdFromToken(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
