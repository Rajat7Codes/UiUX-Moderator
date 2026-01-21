package co.in.nextgencoder.ui_ux_moderator_backend.config;

import com.google.genai.Client;
import com.google.genai.types.HttpOptions;
import com.google.genai.types.HttpRetryOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Bean
    public Client geminiClient() {
        HttpOptions httpOptions = HttpOptions.builder()
                .retryOptions(retryAttempts(3))
                .build();

        return Client.builder()
                .apiKey(apiKey)
                .httpOptions(httpOptions)
                .build();
    }

    private HttpRetryOptions.Builder retryAttempts(int attempts) {
        return HttpRetryOptions.builder()
                .attempts(attempts);
    }
}

