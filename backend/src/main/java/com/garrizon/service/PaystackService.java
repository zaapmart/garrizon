package com.garrizon.service;

import com.garrizon.exception.BadRequestException;
import com.garrizon.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaystackService {

    @Value("${paystack.secret-key}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize";
    private static final String PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify/";

    public Map<String, Object> initializeTransaction(String email, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + secretKey);

        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("amount", amount.multiply(BigDecimal.valueOf(100)).longValue()); // Convert to kobo

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    PAYSTACK_INIT_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );
            
            if (response.getBody() != null && (boolean) response.getBody().get("status")) {
                return (Map<String, Object>) response.getBody().get("data");
            } else {
                throw new BadRequestException("Failed to initialize Paystack transaction");
            }
        } catch (Exception e) {
            throw new BadRequestException("Paystack error: " + e.getMessage());
        }
    }

    public boolean verifyTransaction(String reference) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    PAYSTACK_VERIFY_URL + reference,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (response.getBody() != null && (boolean) response.getBody().get("status")) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                return "success".equals(data.get("status"));
            }
            return false;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Transaction verification failed: " + e.getMessage());
        }
    }
}
