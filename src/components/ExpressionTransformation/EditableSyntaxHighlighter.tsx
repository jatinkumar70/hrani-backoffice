import React, { useState, useEffect, useRef } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const EditableSyntaxHighlighter = () => {
  const [code, setCode] = useState(
    'function hello() {\n  console.log("Hello, world!");\n}',
  );
  const editorRef = useRef<any>(null);

  // Function to handle changes in the contentEditable div
  const handleInputChange = (e: any) => {
    setCode(e.target.innerText); // Set the inner text of the div as the code
  };

  // To keep cursor position when updating the contentEditable field
  useEffect(() => {
    if (editorRef.current) {
      const range = document.createRange();
      const sel: any = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      editorRef.current.focus();
    }
  }, [code]);

  return (
    <div>
      <div
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInputChange}
        ref={editorRef}
        style={{
          whiteSpace: "pre",
          outline: "none",
          fontFamily: "monospace",
          fontSize: "14px",
          borderRadius: "5px",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <SyntaxHighlighter language="javascript" style={atomOneLight}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
