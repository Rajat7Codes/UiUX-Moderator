import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./App.css"
import html2canvas from "html2canvas";
import type { UiEvaluationRequest } from "./models/uiEvaluation";
import { buildUiEvaluationRequest } from "./models/uiEvaluation";

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [domSnapshot, setDomSnapshot] = useState<string | null>(null);
  const [cssSnapshot, setCssSnapshot] = useState<any[] | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);


  const [html, setHtml] = useState<string>(`<div class="container">
  <h1>Hello World</h1>
  <button>Click Me</button>
</div>`);

  const [css, setCss] = useState<string>(`.container {
  padding: 20px;
}`);

  const [js, setJs] = useState<string>(`let btn = document.getElementsByTagName("button")[0]
btn.addEventListener( "click", () => {
    alert("Clicked")
})`);

  const STYLE_PROPS = [
    "display",
    "position",
    "width",
    "height",
    "margin",
    "padding",

    "font-size",
    "font-weight",
    "font-family",
    "line-height",
    "text-align",

    "color",
    "background-color",

    "border",
    "border-radius",

    "flex",
    "justify-content",
    "align-items",
  ];

  const iframeContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      ${css}
    </style>
  </head>
  <body>
    ${html}
    <script>
      try {
        ${js}
      } catch (e) {
        console.error(e);
      }
    </script>
  </body>
</html>
`;

  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const handleSubmit = () => {
  setSubmitted(true);

  setTimeout(async () => {
    try {
      const iframe = iFrameRef.current;
      if (!iframe) return;

      const doc = iframe.contentDocument;
      if (!doc) return;

      // 1. Capture artifacts into LOCAL variables
      const serializedDOM = doc.documentElement.outerHTML;
      const cssData = extractStyles(doc);
      const image = await captureScreenshot(iframe);

      // 2. Update state ONLY for debug / UI
      setDomSnapshot(serializedDOM);
      setCssSnapshot(cssData);
      setScreenshot(image);

      console.log("DOM Snapshot:", serializedDOM);
      console.log("CSS Snapshot:", cssData);
      console.log("Screenshot captured");

      // 3. Build request from LOCAL variables (critical fix)
      const requestPayload: UiEvaluationRequest = buildUiEvaluationRequest({
        dom: serializedDOM,
        css: cssData,
        screenshot: image!,
      });

      console.log("Final UI Evaluation Request", JSON.stringify(requestPayload));
    } catch (e) {
      console.error("Extraction failed", e);
    }
  }, 300);
  };


  const captureScreenshot = async (iframe: HTMLIFrameElement) => {
    const doc = iframe.contentDocument;
    if (!doc) return null;

    const body = doc.body;

    const canvas = await html2canvas(body, {
      backgroundColor: "#ffffff",
      scale: 1,
      useCORS: true,
    });

    return canvas.toDataURL("image/png");
  };

  const shouldIncludeNode = (el: Element) => {
    const style = window.getComputedStyle(el);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  };

  const extractStyles = (doc: Document) => {
    const result: any[] = [];

    const walk = (el: Element, depth: number) => {
      if (depth > 3) return;
      if (!shouldIncludeNode(el)) return;

      const computed = window.getComputedStyle(el);
      const styles: Record<string, string> = {};

      STYLE_PROPS.forEach((prop) => {
        styles[prop] = computed.getPropertyValue(prop);
      });

      result.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        class: el.className || null,
        styles,
      });

      Array.from(el.children).forEach((child) =>
        walk(child, depth + 1)
      );
    };

    walk(doc.body, 0);
    return result;
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          height: "56px",
          background: "#1e1e1e",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          fontWeight: 600,
        }}
      >
        <span>UI / UX Moderator</span>
        <div className="action-btn-group">
          <button
            style={{
              background: "#4f46e5",
              color: "#ffffff",
              border: "none",
              padding: "6px 12px",
              marginRight: "12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleSubmit}
            disabled={submitted}
          >
            Submit
          </button>
          <button
            style={{
              background: "#4f46e5",
              color: "#ffffff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              setSubmitted(false);
              setDomSnapshot(null);
              setCssSnapshot(null);
              setScreenshot(null);
            }}
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Editors */}
        <div
          style={{
            width: "50%",
            minWidth: "320px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #ddd",
            background: "#f5f5f5",
          }}
        >
          {/* HTML */}
          <Section title="HTML">
            <Editor
              language="html"
              value={html}
              onChange={(v) => setHtml(v || "")}
              theme="vs-dark"
              options={{
                readOnly: submitted,
                minimap: { enabled: false }
              }}
            />
          </Section>

          {/* CSS */}
          <Section title="CSS">
            <Editor
              language="css"
              value={css}
              onChange={(v) => setCss(v || "")}
              theme="vs-dark"
              options={{
                readOnly: submitted,
                minimap: { enabled: false }
              }}
            />
          </Section>

          {/* JS */}
          <Section title="JavaScript">
            <Editor
              language="javascript"
              value={js}
              onChange={(v) => setJs(v || "")}
              theme="vs-dark"
              options={{
                readOnly: submitted,
                minimap: { enabled: false }
              }}
            />
          </Section>
        </div>

        {/* Right: Preview Placeholder */}


        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <iframe
            title="preview"
            key={(submitted ? "submitted" : html + css + js)}
            srcDoc={iframeContent}
            ref={iFrameRef}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "white",
            }}
          />
          {screenshot && (
            <div style={{ padding: "8px", borderTop: "1px solid #ddd" }}>
              <img
                src={screenshot}
                alt="UI Screenshot"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "6px 8px",
          fontSize: "12px",
          fontWeight: 600,
          background: "#181829ff",
          color: "#ccc",
          borderBottom: "1px solid #464646ff",
        }}
      >
        {title}
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

export default App;
