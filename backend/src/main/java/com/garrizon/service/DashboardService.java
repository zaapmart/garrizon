package com.garrizon.service;

import com.garrizon.dto.DashboardStatsDTO;
import com.garrizon.dto.OrderDTO;
import com.garrizon.repository.OrderRepository;
import com.garrizon.repository.ProductRepository;
import com.garrizon.repository.TransactionRepository;
import com.garrizon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderService orderService;
    private final TransactionService transactionService;
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        // Today's metrics
        BigDecimal todayRevenue = orderService.getTodayRevenue();
        Long ordersToday = orderService.countOrdersToday();
        Long pendingOrders = orderService.countPendingOrders();
        Long failedTransactions = transactionService.countFailedTransactions();
        Long lowStockItems = countLowStockItems();

        // Total metrics
        BigDecimal totalRevenue = orderService.getTotalRevenue();
        Long totalOrders = orderService.getTotalOrders();
        Long totalCustomers = userRepository.count();
        Long totalProducts = productRepository.count();

        // Calculate changes (mock for now - you can implement actual logic)
        Double revenueChange = calculateRevenueChange();
        Double ordersChange = calculateOrdersChange();

        // Recent orders
        List<OrderDTO> recentOrders = orderService.getRecentOrders();

        // Top products (mock for now)
        List<DashboardStatsDTO.TopProductDTO> topProducts = new ArrayList<>();

        return DashboardStatsDTO.builder()
                .todayRevenue(todayRevenue)
                .ordersToday(ordersToday)
                .pendingOrders(pendingOrders)
                .failedTransactions(failedTransactions)
                .lowStockItems(lowStockItems)
                .revenueChange(revenueChange)
                .ordersChange(ordersChange)
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .recentOrders(recentOrders)
                .topProducts(topProducts)
                .build();
    }

    private Long countLowStockItems() {
        // Count products where stock <= low_stock_threshold
        // This requires a custom query - for now return 0
        return 0L;
    }

    private Double calculateRevenueChange() {
        // Calculate percentage change from yesterday
        // For now, return a mock value
        return 12.5;
    }

    private Double calculateOrdersChange() {
        // Calculate percentage change from yesterday
        // For now, return a mock value
        return -3.2;
    }
}
