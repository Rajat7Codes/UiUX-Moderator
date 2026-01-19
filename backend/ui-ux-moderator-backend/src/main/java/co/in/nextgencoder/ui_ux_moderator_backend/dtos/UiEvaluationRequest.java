package co.in.nextgencoder.ui_ux_moderator_backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class UiEvaluationRequest {

    private Metadata metadata;
    private Artifacts artifacts;

    @Data
    public static class Metadata {
        private Viewport viewport;
        private String capturedAt;
    }

    @Data
    public static class Viewport {
        private int width;
        private int height;
    }

    @Data
    public static class Artifacts {
        private String dom;
        private List<CssNode> css;
        private String screenshot;
    }

    @Data
    public static class CssNode {
        private String tag;
        private String id;
        @JsonProperty("class")
        private String className; // map "class" safely
        private Map<String, String> styles;
    }
}

