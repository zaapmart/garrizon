package com.garrizon.controller;

import com.garrizon.dto.OrderDTO;
import com.garrizon.exception.BadRequestException;
import com.garrizon.model.Order;
import com.garrizon.model.PaymentStatus;
import com.garrizon.repository.OrderRepository;
import com.garrizon.service.OrderService;
import com.garrizon.service.PaystackService;
import com.garrizon.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
@Tag(name = "Checkout", description = "Payment processing APIs")
public class CheckoutController {

    private final StripeService stripeService;
    private final PaystackService paystackService;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @PostMapping("/stripe/create-payment-intent")
    @Operation(summary = "Create Stripe PaymentIntent")
    public ResponseEntity<Map<String, String>> createStripePaymentIntent(@RequestBody Map<String, Object> request) throws StripeException {
        Long orderId = Long.parseLong(request.get("orderId").toString());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException("Order not found"));

        PaymentIntent paymentIntent = stripeService.createPaymentIntent(order.getTotalAmount(), "usd");
        
        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/paystack/initialize")
    @Operation(summary = "Initialize Paystack transaction")
    public ResponseEntity<Map<String, Object>> initializePaystackTransaction(@RequestBody Map<String, Object> request) {
        Long orderId = Long.parseLong(request.get("orderId").toString());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException("Order not found"));

        return ResponseEntity.ok(paystackService.initializeTransaction(order.getCustomerEmail(), order.getTotalAmount()));
    }

    @PostMapping("/verify-payment")
    @Operation(summary = "Verify payment status (Stripe or Paystack)")
    public ResponseEntity<OrderDTO> verifyPayment(@RequestBody Map<String, String> request) throws StripeException {
        Long orderId = Long.parseLong(request.get("orderId"));
        String provider = request.get("provider");
        String reference = request.get("reference"); // PaymentIntentId for Stripe, Reference for Paystack

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException("Order not found"));

        boolean isSuccess = false;

        if ("STRIPE".equalsIgnoreCase(provider)) {
            PaymentIntent intent = stripeService.retrievePaymentIntent(reference);
            if ("succeeded".equals(intent.getStatus())) {
                isSuccess = true;
            }
        } else if ("PAYSTACK".equalsIgnoreCase(provider)) {
            isSuccess = paystackService.verifyTransaction(reference);
        }

        if (isSuccess) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            order.setPaymentIntentId(reference);
            orderRepository.save(order);
            // TODO: Trigger email confirmation here
        }

        return ResponseEntity.ok(orderService.getOrder(orderId));
    }
}
