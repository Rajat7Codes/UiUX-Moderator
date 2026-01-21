package co.in.nextgencoder.ui_ux_moderator_backend.dtos;

import java.util.List;

public record UiEvaluationResponse(
        String summary,
        List<String> issues,
        List<String> suggestions,
        int score
) {}
