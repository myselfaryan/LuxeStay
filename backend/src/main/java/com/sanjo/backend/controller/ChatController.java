package com.sanjo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanjo.backend.dto.Response;
import com.sanjo.backend.dto.RoomDTO;
import com.sanjo.backend.service.interfac.IRoomService;
import com.sanjo.backend.service.implementation.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiService geminiService;
    private final IRoomService roomService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/chat")
    public ResponseEntity<Response> chat(@RequestBody Map<String, String> request) {
        Response response = new Response();
        try {
            String userMessage = request.get("message");
            String aiResponse = geminiService.getChatResponse(userMessage);

            response.setStatusCode(200);
            response.setMessage(aiResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error processing chat: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/recommend-rooms")
    public ResponseEntity<Response> recommendRooms(@RequestBody Map<String, String> request) {
        Response response = new Response();
        try {
            String userRequest = request.get("query");

            // 1. Get all rooms
            Response allRoomsResponse = roomService.getAllRooms();
            List<RoomDTO> rooms = allRoomsResponse.getRoomList();

            // 2. Convert rooms to JSON string for AI
            String roomsJson = objectMapper.writeValueAsString(rooms);

            // 3. Get recommendations from Gemini
            String recommendationsJson = geminiService.getRoomRecommendations(userRequest, roomsJson);

            response.setStatusCode(200);
            response.setMessage(recommendationsJson); // This will be a JSON string inside the message field
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
