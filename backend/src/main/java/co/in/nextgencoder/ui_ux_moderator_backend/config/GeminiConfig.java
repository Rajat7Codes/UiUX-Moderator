package co.in.nextgencoder.ui_ux_moderator_backend.config;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {
    @Value("${gemini.api.key}")
    private String apiKey;

    @Bean
    public Client geminiClient() {
        // By NOT setting .vertexAI(true), this client is locked to
        // the Google AI Studio free tier.
        return Client.builder()
                .apiKey(apiKey)
                .build();
    }
}

