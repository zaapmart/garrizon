package com.garrizon.service;

import com.garrizon.model.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// @Service - Disabled for development (no email server configured)
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${resend.from-email:noreply@garrizon.com}")
    private String fromEmail;

    @Autowired(required = false)
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Note: In a real production app, we would use Resend API directly or via SMTP
    // For this implementation, we'll use Spring Mail which can be configured for
    // SMTP (Resend supports SMTP)

    public void sendOrderConfirmation(Order order) {
        if (mailSender == null) {
            log.warn("JavaMailSender not configured. Skipping email for order: {}", order.getOrderNumber());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(order.getCustomerEmail());
        message.setSubject("Order Confirmation - " + order.getOrderNumber());
        message.setText("Thank you for your order!\n\n" +
                "Order Number: " + order.getOrderNumber() + "\n" +
                "Total Amount: $" + order.getTotalAmount() + "\n\n" +
                "We will notify you when your order is shipped.");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
        }
    }

    public void sendOrderStatusUpdate(Order order) {
        if (mailSender == null) {
            log.warn("JavaMailSender not configured. Skipping email for order: {}", order.getOrderNumber());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(order.getCustomerEmail());
        message.setSubject("Order Update - " + order.getOrderNumber());
        message.setText("Your order status has been updated to: " + order.getStatus() + "\n\n" +
                "Order Number: " + order.getOrderNumber());

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
        }
    }

    public void sendAbandonedCartEmail(String email, String firstName) {
        if (mailSender == null) {
            log.warn("JavaMailSender not configured. Skipping abandoned cart email for: {}", email);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("You left something behind!");
        message.setText("Hi " + firstName + ",\n\n" +
                "We noticed you left some items in your cart. Complete your purchase now before they sell out!");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
        }
    }
}
