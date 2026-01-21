package co.in.nextgencoder.ui_ux_moderator_backend.controller;

import co.in.nextgencoder.ui_ux_moderator_backend.dtos.UiEvaluationRequest;
import co.in.nextgencoder.ui_ux_moderator_backend.dtos.UiEvaluationResponse;
import co.in.nextgencoder.ui_ux_moderator_backend.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("/api/evaluate")
@CrossOrigin // Phase 1 only
public class EvaluationController {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EvaluationController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public UiEvaluationResponse evaluate(@RequestBody UiEvaluationRequest request) {

        try {
            // 1. Decode screenshot
            String base64Image = request.getArtifacts()
                    .getScreenshot()
                    .split(",")[1];

            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            // 2. Strict JSON-only prompt
            String prompt = """
You are a UI/UX reviewer.

Return ONLY valid JSON in this exact format:
{
  "summary": string,
  "issues": string[],
  "suggestions": string[],
  "score": number
}

Rules:
- No markdown
- No explanations
- No extra keys
- Score must be between 0 and 100

Evaluate layout, spacing, hierarchy, and clarity.
""";

            // 3. Call Gemini
            String aiResponse = geminiService.evaluateUI(prompt, imageBytes);

            System.out.println("===== GEMINI RAW RESPONSE =====");
            System.out.println(aiResponse);

            // 4. Parse AI JSON safely
            return objectMapper.readValue(aiResponse, UiEvaluationResponse.class);

        } catch (Exception e) {
            // 5. Fail-safe response (UI must not break)
            e.printStackTrace();
            return new UiEvaluationResponse(
                    "Unable to evaluate UI at this time.",
                    java.util.List.of(),
                    java.util.List.of(),
                    0
            );
        }
    }
}
