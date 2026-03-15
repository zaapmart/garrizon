package com.garrizon.controller;

import com.garrizon.dto.OrderDTO;
import com.garrizon.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {

    private final OrderService orderService;

    // Note: These methods are placeholders for future implementation
    // The actual order creation and user order retrieval will be implemented later

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get order details")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

}
