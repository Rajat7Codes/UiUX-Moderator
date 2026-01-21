package co.in.nextgencoder.ui_ux_moderator_backend.service;

import com.google.genai.Client;
import com.google.genai.types.*;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(Client client) {
        this.client = client;
    }

    public String evaluateUI(String prompt, byte[] imageBytes) {
        // 1. Setup the model (Flash-Lite is the most "free" friendly model)
        String modelName = "gemini-2.5-flash-lite";

        // 2. Build the parts
        Part textPart = Part.builder().text(prompt).build();
        Part imagePart = Part.builder()
                .inlineData(Blob.builder()
                        .mimeType("image/png")
                        .data(imageBytes)
                        .build())
                .build();

        // 3. Wrap in a Content object with the "user" role
        Content content = Content.builder()
                .role("user")
                .parts(Arrays.asList(textPart, imagePart))
                .build();

        // 4. Generate response
        GenerateContentResponse response = client.models.generateContent(
                modelName,
                Collections.singletonList(content),
                GenerateContentConfig.builder()
                        .maxOutputTokens(2048)
                        .temperature(0.2f)
                        .build()
        );

        return response.text();
    }
}