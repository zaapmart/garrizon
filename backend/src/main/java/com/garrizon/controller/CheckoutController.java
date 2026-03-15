package com.garrizon.controller;

import com.garrizon.dto.OrderDTO;
import com.garrizon.exception.BadRequestException;
import com.garrizon.model.Order;
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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
@Tag(name = "Checkout", description = "Payment processing APIs")
public class CheckoutController {

    private final StripeService stripeService;
    private final PaystackService paystackService;
    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping("/stripe/create-payment-intent")
    @Operation(summary = "Create Stripe payment intent")
    public ResponseEntity<Map<String, String>> createStripePaymentIntent(
            @RequestParam Long orderId) throws StripeException {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException("Order not found"));

        PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                order.getTotalAmount(),
                "NGN");

        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("paymentIntentId", paymentIntent.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/paystack/initialize")
    @Operation(summary = "Initialize Paystack payment")
    public ResponseEntity<Map<String, Object>> initializePaystackPayment(
            @RequestParam Long orderId,
            @RequestParam String email) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException("Order not found"));

        Map<String, Object> paystackResponse = paystackService.initializeTransaction(
                email,
                order.getTotalAmount());

        return ResponseEntity.ok(paystackResponse);
    }

    @GetMapping("/verify-payment/{orderId}")
    @Operation(summary = "Verify payment status")
    public ResponseEntity<OrderDTO> verifyPayment(
            @PathVariable Long orderId,
            @RequestParam String reference,
            @RequestParam(required = false) String provider) throws StripeException {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BadRequestException("Order not found"));

        boolean isSuccess = false;

        if ("paystack".equalsIgnoreCase(provider)) {
            isSuccess = paystackService.verifyTransaction(reference);
        } else {
            // Assume Stripe - verify by retrieving the payment intent
            PaymentIntent intent = stripeService.retrievePaymentIntent(reference);
            isSuccess = "succeeded".equals(intent.getStatus());
        }

        if (isSuccess) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            orderRepository.save(order);
            // TODO: Trigger email confirmation here
        }

        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
}
