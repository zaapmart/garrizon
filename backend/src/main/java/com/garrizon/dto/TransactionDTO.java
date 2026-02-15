package com.garrizon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    private Long id;
    private String reference;
    private Long orderId;
    private String orderNumber;
    private Long userId;

    // Transaction details
    private BigDecimal amount;
    private String currency;
    private String status;

    // Payment gateway details
    private String paymentMethod;
    private String paymentGateway;
    private String gatewayReference;

    // Customer details
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime paidAt;
    private LocalDateTime failedAt;
}
