package com.garrizon.service;

import com.garrizon.dto.OrderDTO;
import com.garrizon.exception.ResourceNotFoundException;
import com.garrizon.model.Order;
import com.garrizon.model.Order.OrderStatus;
import com.garrizon.model.Order.PaymentStatus;
import com.garrizon.model.OrderItem;
import com.garrizon.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;

        @Transactional(readOnly = true)
        public Page<OrderDTO> getAllOrders(OrderStatus status, PaymentStatus paymentStatus, String search,
                        Pageable pageable) {
                Page<Order> orders = orderRepository.findByFilters(status, paymentStatus, search, pageable);
                return orders.map(this::mapToDTO);
        }

        @Transactional(readOnly = true)
        public OrderDTO getOrderById(Long id) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
                return mapToDTO(order);
        }

        @Transactional(readOnly = true)
        public OrderDTO getOrderByOrderNumber(String orderNumber) {
                Order order = orderRepository.findByOrderNumber(orderNumber)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Order not found with number: " + orderNumber));
                return mapToDTO(order);
        }

        @Transactional(readOnly = true)
        public List<OrderDTO> getRecentOrders() {
                List<Order> orders = orderRepository.findTop10ByOrderByCreatedAtDesc();
                return orders.stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional
        public OrderDTO updateOrderStatus(Long id, OrderStatus status) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

                order.setStatus(status);

                if (status == OrderStatus.COMPLETED) {
                        order.setCompletedAt(LocalDateTime.now());
                } else if (status == OrderStatus.CANCELLED) {
                        order.setCancelledAt(LocalDateTime.now());
                }

                Order updatedOrder = orderRepository.save(order);
                return mapToDTO(updatedOrder);
        }

        @Transactional
        public OrderDTO updatePaymentStatus(Long id, PaymentStatus paymentStatus) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

                order.setPaymentStatus(paymentStatus);
                Order updatedOrder = orderRepository.save(order);
                return mapToDTO(updatedOrder);
        }

        @Transactional
        public OrderDTO addAdminNotes(Long id, String notes) {
                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

                order.setAdminNotes(notes);
                Order updatedOrder = orderRepository.save(order);
                return mapToDTO(updatedOrder);
        }

        // Statistics methods
        @Transactional(readOnly = true)
        public Long countOrdersToday() {
                LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
                return orderRepository.countOrdersToday(startOfDay);
        }

        @Transactional(readOnly = true)
        public Long countPendingOrders() {
                return orderRepository.countByStatus(OrderStatus.PENDING);
        }

        @Transactional(readOnly = true)
        public BigDecimal getTodayRevenue() {
                LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
                return orderRepository.sumRevenueToday(startOfDay);
        }

        @Transactional(readOnly = true)
        public BigDecimal getTotalRevenue() {
                return orderRepository.sumTotalRevenue();
        }

        @Transactional(readOnly = true)
        public Long getTotalOrders() {
                return orderRepository.count();
        }

        // Mapping methods
        private OrderDTO mapToDTO(Order order) {
                return OrderDTO.builder()
                                .id(order.getId())
                                .orderNumber(order.getOrderNumber())
                                .userId(order.getUser().getId())
                                .customerName(order.getShippingName())
                                .customerEmail(order.getShippingEmail())
                                .subtotal(order.getSubtotal())
                                .taxAmount(order.getTaxAmount())
                                .shippingAmount(order.getShippingAmount())
                                .discountAmount(order.getDiscountAmount())
                                .totalAmount(order.getTotalAmount())
                                .status(order.getStatus().name())
                                .paymentStatus(order.getPaymentStatus().name())
                                .shippingName(order.getShippingName())
                                .shippingEmail(order.getShippingEmail())
                                .shippingPhone(order.getShippingPhone())
                                .shippingAddressLine1(order.getShippingAddressLine1())
                                .shippingAddressLine2(order.getShippingAddressLine2())
                                .shippingCity(order.getShippingCity())
                                .shippingState(order.getShippingState())
                                .shippingPostalCode(order.getShippingPostalCode())
                                .shippingCountry(order.getShippingCountry())
                                .paymentMethod(order.getPaymentMethod())
                                .paymentReference(order.getPaymentReference())
                                .customerNotes(order.getCustomerNotes())
                                .adminNotes(order.getAdminNotes())
                                .items(order.getItems().stream()
                                                .map(this::mapItemToDTO)
                                                .collect(Collectors.toList()))
                                .itemCount(order.getItemCount())
                                .createdAt(order.getCreatedAt())
                                .updatedAt(order.getUpdatedAt())
                                .completedAt(order.getCompletedAt())
                                .cancelledAt(order.getCancelledAt())
                                .build();
        }

        private OrderDTO.OrderItemDTO mapItemToDTO(OrderItem item) {
                return OrderDTO.OrderItemDTO.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productName(item.getProductName())
                                .productSlug(item.getProductSlug())
                                .productImageUrl(item.getProductImageUrl())
                                .unitPrice(item.getUnitPrice())
                                .quantity(item.getQuantity())
                                .subtotal(item.getSubtotal())
                                .build();
        }
}
