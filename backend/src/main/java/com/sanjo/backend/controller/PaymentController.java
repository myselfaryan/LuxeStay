package com.sanjo.backend.controller;

import com.sanjo.backend.dto.Response;
import com.sanjo.backend.service.implementation.PaymentService;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Response> createPaymentIntent(@RequestBody Map<String, Object> request) {
        Response response = new Response();
        try {
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            PaymentIntent paymentIntent = paymentService.createPaymentIntent(amount);

            response.setStatusCode(200);
            response.setClientSecret(paymentIntent.getClientSecret());
            response.setMessage("Payment Intent Created");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error creating payment intent: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
