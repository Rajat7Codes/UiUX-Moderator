export type UiEvaluationRequest = {
  metadata: {
    viewport: {
      width: number;
      height: number;
    };
    capturedAt: string;
  };

  artifacts: {
    dom: string;
    css: Array<{
      tag: string;
      id: string | null;
      class: string | null;
      styles: Record<string, string>;
    }>;
    screenshot: string; // base64 PNG
  };
};

export function buildUiEvaluationRequest(params: {
  dom: string;
  css: Array<{
    tag: string;
    id: string | null;
    class: string | null;
    styles: Record<string, string>;
  }>;
  screenshot: string;
}): UiEvaluationRequest {
  return {
    metadata: {
      viewport: {
        width: 1440,
        height: 900,
      },
      capturedAt: new Date().toISOString(),
    },
    artifacts: {
      dom: params.dom,
      css: params.css,
      screenshot: params.screenshot,
    },
  };
}
