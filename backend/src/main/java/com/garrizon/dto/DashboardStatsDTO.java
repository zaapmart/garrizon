package com.garrizon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    // Today's metrics
    private BigDecimal todayRevenue;
    private Long ordersToday;
    private Long pendingOrders;
    private Long failedTransactions;
    private Long lowStockItems;

    // Changes (percentage)
    private Double revenueChange;
    private Double ordersChange;

    // Total metrics
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalProducts;

    // Recent orders
    private List<OrderDTO> recentOrders;

    // Top products
    private List<TopProductDTO> topProducts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProductDTO {
        private Long id;
        private String name;
        private String slug;
        private String imageUrl;
        private Long salesCount;
        private BigDecimal revenue;
    }
}
