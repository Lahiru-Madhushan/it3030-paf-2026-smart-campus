package com.example.campus_hub_backend.controller;

import com.example.campus_hub_backend.dto.ChatRequest;
import com.example.campus_hub_backend.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.chat.n8n-webhook:}")
    private String n8nWebhookUrl;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        if (request == null || !StringUtils.hasText(request.getMessage())) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Please enter a message."));
        }

        if (!StringUtils.hasText(n8nWebhookUrl)) {
            return ResponseEntity.ok(new ChatResponse(
                    "Chat automation is not configured. Set app.chat.n8n-webhook in application.properties "
                            + "to your n8n webhook URL."));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("message", request.getMessage().trim());
        if (StringUtils.hasText(request.getUserId())) {
            body.put("userId", request.getUserId());
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    n8nWebhookUrl.trim(),
                    entity,
                    String.class
            );

            String raw = response.getBody();
            String reply = StringUtils.hasText(raw) ? raw.trim()
                    : "No response from the chat service.";

            return ResponseEntity.ok(new ChatResponse(reply));
        } catch (RestClientException ex) {
            return ResponseEntity.ok(new ChatResponse(
                    "Unable to reach the chat automation service. Check that n8n is running and the webhook URL is correct."));
        }
    }
}
