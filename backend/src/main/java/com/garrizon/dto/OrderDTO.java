package com.garrizon.dto;

import com.garrizon.model.OrderStatus;
import com.garrizon.model.PaymentProvider;
import com.garrizon.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private List<OrderItemDTO> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private PaymentProvider paymentProvider;
    private PaymentStatus paymentStatus;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private String customerName;
    private String customerEmail;
}
