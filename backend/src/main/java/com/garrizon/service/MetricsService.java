package com.garrizon.service;

import com.garrizon.model.OrderStatus;
import com.garrizon.repository.OrderRepository;
import com.garrizon.repository.ProductRepository;
import com.garrizon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfMonth = LocalDateTime.now().minusDays(30);

        // Basic counts
        metrics.put("totalOrders", orderRepository.count());
        metrics.put("totalCustomers", userRepository.count());
        metrics.put("totalProducts", productRepository.count());
        
        // Sales metrics
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        metrics.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        metrics.put("ordersToday", orderRepository.countOrdersSince(startOfDay));
        
        // Order status breakdown
        Map<String, Long> statusBreakdown = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            statusBreakdown.put(status.name(), orderRepository.countByStatus(status));
        }
        metrics.put("orderStatusBreakdown", statusBreakdown);
        
        // Revenue chart data (simplified for now)
        metrics.put("recentOrders", orderRepository.findCompletedOrdersSince(startOfMonth));
        
        return metrics;
    }
}
