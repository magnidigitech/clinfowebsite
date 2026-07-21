import React, { useEffect, useRef } from "react";

export function formatExternalUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function RichTextEditor({ label, value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;
    const nextValue = value || "";
    if (editor.innerHTML !== nextValue) editor.innerHTML = nextValue;
  }, [value]);

  function syncValue() {
    onChange(editorRef.current?.innerHTML || "");
  }

  function runCommand(command, argument = null) {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    syncValue();
  }

  function addLink() {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    runCommand("createLink", formatExternalUrl(url));
  }

  return (
    <div>
      <span className="form-label">{label}</span>
      <div className="rich-editor-wrapper">
        <div className="rich-editor-toolbar" aria-label={`${label} formatting toolbar`}>
          <button type="button" onClick={() => runCommand("bold")} className="rich-editor-tool" title="Bold">B</button>
          <button type="button" onClick={() => runCommand("italic")} className="rich-editor-tool italic" title="Italic">I</button>
          <button type="button" onClick={() => runCommand("underline")} className="rich-editor-tool underline" title="Underline">U</button>
          <button type="button" onClick={() => runCommand("insertUnorderedList")} className="rich-editor-tool" title="Bulleted list">•</button>
          <button type="button" onClick={() => runCommand("insertOrderedList")} className="rich-editor-tool" title="Numbered list">1.</button>
          <select
            className="rich-editor-select"
            defaultValue=""
            onChange={(event) => {
              if (!event.target.value) return;
              runCommand("fontSize", event.target.value);
              event.target.value = "";
            }}
            title="Text size"
          >
            <option value="" disabled>Size</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">XL</option>
            <option value="6">XXL</option>
          </select>
          <button type="button" onClick={addLink} className="rich-editor-tool" title="Add link">Link</button>
          <label className="rich-editor-color" title="Text color">
            <span>Color</span>
            <input type="color" defaultValue="#0f172a" onChange={(event) => runCommand("foreColor", event.target.value)} />
          </label>
          <label className="rich-editor-color" title="Highlight color">
            <span>Highlight</span>
            <input type="color" defaultValue="#fff3bf" onChange={(event) => runCommand("hiliteColor", event.target.value)} />
          </label>
          <button type="button" onClick={() => runCommand("removeFormat")} className="rich-editor-tool" title="Clear formatting">Clear</button>
        </div>
        <div
          ref={editorRef}
          className="rich-editor-input"
          contentEditable
          suppressContentEditableWarning
          onInput={syncValue}
          onBlur={syncValue}
          role="textbox"
          aria-multiline="true"
        />
      </div>
    </div>
  );
}
