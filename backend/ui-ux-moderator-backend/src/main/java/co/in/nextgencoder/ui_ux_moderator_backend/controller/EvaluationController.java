package co.in.nextgencoder.ui_ux_moderator_backend.controller;

import co.in.nextgencoder.ui_ux_moderator_backend.dtos.UiEvaluationRequest;
import co.in.nextgencoder.ui_ux_moderator_backend.service.GeminiService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/evaluate")
@CrossOrigin // Phase 1 only
public class EvaluationController {

    private final GeminiService geminiService;

    public EvaluationController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public String evaluate(@RequestBody UiEvaluationRequest request) throws IOException {

        String base64Image =
                request.getArtifacts()
                        .getScreenshot()
                        .split(",")[1];

        byte[] imageBytes =
                Base64.getDecoder().decode(base64Image);

        String prompt = """
You are a UX reviewer.
Review the UI shown in the screenshot.
Give brief feedback on layout, spacing, and clarity.
""";

        String aiResponse =
                geminiService.evaluateUI(prompt, imageBytes);

        System.out.println("===== GEMINI RESPONSE =====");
        System.out.println(aiResponse);

        return "OK";
    }
}
