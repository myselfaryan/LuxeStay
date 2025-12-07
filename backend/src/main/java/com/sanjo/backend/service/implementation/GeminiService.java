package com.sanjo.backend.service.implementation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.restClient = RestClient.create();
        this.objectMapper = new ObjectMapper();
    }

    public String getChatResponse(String userMessage) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                + apiKey;

        try {
            // Construct the JSON body
            ObjectNode rootNode = objectMapper.createObjectNode();
            ArrayNode contentsNode = rootNode.putArray("contents");
            ObjectNode contentNode = contentsNode.addObject();
            ArrayNode partsNode = contentNode.putArray("parts");
            ObjectNode partNode = partsNode.addObject();

            // System Prompt + User Message
            String systemPrompt = "You are the AI Concierge for LuxeStay, a luxury hotel booking platform. " +
                    "Here are the key details about our hotel:\n" +
                    "- **Breakfast**: Continental breakfast is INCLUDED with ALL bookings.\n" +
                    "- **Check-in**: 2:00 PM\n" +
                    "- **Check-out**: 11:00 AM\n" +
                    "- **Amenities**: Free high-speed Wi-Fi, 24/7 Gym, Rooftop Swimming Pool, and Luxury Spa.\n" +
                    "- **Location**: 123 Luxury Avenue, Paradise City.\n" +
                    "- **Parking**: Free valet parking for all guests.\n" +
                    "Your role is to assist guests with questions about our rooms, amenities, and policies based on this information. "
                    +
                    "Be polite, professional, and helpful. Keep answers concise. " +
                    "If a guest asks something not covered here, politely say you will check with the front desk. " +
                    "Do not answer questions unrelated to the hotel.";

            partNode.put("text", systemPrompt + "\n\nUser Question: " + userMessage);

            String requestBody = objectMapper.writeValueAsString(rootNode);

            String response = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            // Parse response
            JsonNode responseNode = objectMapper.readTree(response);
            return responseNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        } catch (Exception e) {
            System.out.println("Error in GeminiService: " + e.getMessage());
            e.printStackTrace();
            return "I'm sorry, I'm having trouble connecting to the concierge service right now.";
        }
    }

    public String getRoomRecommendations(String userRequest, String roomInventoryJson) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                + apiKey;

        try {
            ObjectNode rootNode = objectMapper.createObjectNode();
            ArrayNode contentsNode = rootNode.putArray("contents");
            ObjectNode contentNode = contentsNode.addObject();
            ArrayNode partsNode = contentNode.putArray("parts");
            ObjectNode partNode = partsNode.addObject();

            String systemPrompt = "You are an expert hotel booking assistant for LuxeStay. " +
                    "Your goal is to recommend the best rooms for a user based on their natural language request. " +
                    "You will be provided with the User's Request and a JSON list of Available Rooms. " +
                    "Analyze the user's needs (budget, vibe, amenities, etc.) and match them with the rooms. " +
                    "Return a JSON Object with a single key 'recommendations' which is a list of objects. " +
                    "Each object in the list must have: " +
                    "'roomId' (Long, matching the input ID), " +
                    "'matchScore' (Integer 0-100), " +
                    "and 'reason' (String, a personalized explanation of why this room fits their request). " +
                    "Do NOT return markdown formatting (like ```json), just the raw JSON string.";

            partNode.put("text",
                    systemPrompt + "\n\nUser Request: " + userRequest + "\n\nAvailable Rooms: " + roomInventoryJson);

            String requestBody = objectMapper.writeValueAsString(rootNode);

            String response = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode responseNode = objectMapper.readTree(response);
            String rawText = responseNode.path("candidates").get(0).path("content").path("parts").get(0).path("text")
                    .asText();

            // Clean up markdown if Gemini adds it despite instructions
            return rawText.replace("```json", "").replace("```", "").trim();

        } catch (Exception e) {
            System.out.println("Error in GeminiService Recommendations: " + e.getMessage());
            e.printStackTrace();
            return "{\"recommendations\": []}";
        }
    }
}
