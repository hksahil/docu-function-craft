
import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface CodeViewerProps {
  code: string;
}

const CodeViewer = ({ code }: CodeViewerProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-[550px] w-full border rounded-sm overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        options={{
          readOnly: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
        }}
        onMount={handleEditorDidMount}
        theme="vs"
      />
    </div>
  );
};

export default CodeViewer;
