package com.garrizon.scheduler;

import com.garrizon.model.Cart;
import com.garrizon.repository.CartRepository;
import com.garrizon.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

// @Component - Disabled for development (depends on EmailService)
@RequiredArgsConstructor
@Slf4j
public class AbandonedCartScheduler {

    private final CartRepository cartRepository;
    private final EmailService emailService;

    @Scheduled(cron = "${scheduler.abandoned-cart.cron}")
    @Transactional
    public void processAbandonedCarts() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(1); // 1 hour inactivity
        LocalDateTime emailThreshold = LocalDateTime.now().minusDays(1); // Don't spam, 1 email per day max

        List<Cart> abandonedCarts = cartRepository.findAbandonedCarts(threshold, emailThreshold);

        for (Cart cart : abandonedCarts) {
            if (cart.getUser() != null) {
                emailService.sendAbandonedCartEmail(cart.getUser().getEmail(), cart.getUser().getFirstName());

                cart.setLastEmailSentAt(LocalDateTime.now());
                cartRepository.save(cart);
            }
        }
    }
}
