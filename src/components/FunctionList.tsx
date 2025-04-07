
import { PythonFunction } from "@/types/pythonTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, FileFunction } from "lucide-react";

interface FunctionListProps {
  functions: PythonFunction[];
  selectedFunction: PythonFunction | null;
  onSelectFunction: (func: PythonFunction) => void;
}

const FunctionList = ({ 
  functions, 
  selectedFunction, 
  onSelectFunction 
}: FunctionListProps) => {
  // Group functions by file name
  const functionsByFile = functions.reduce((acc, func) => {
    if (!acc[func.fileName]) {
      acc[func.fileName] = [];
    }
    acc[func.fileName].push(func);
    return acc;
  }, {} as Record<string, PythonFunction[]>);

  if (functions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileFunction className="h-5 w-5 text-blue-600" />
            Functions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 italic">
            Upload Python files to see extracted functions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileFunction className="h-5 w-5 text-blue-600" />
          Functions ({functions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {Object.entries(functionsByFile).map(([fileName, fileFunctions]) => (
            <div key={fileName} className="mb-2">
              <div className="bg-slate-200 px-4 py-2 text-sm font-medium flex items-center">
                <Code className="h-4 w-4 mr-2 text-blue-600" />
                {fileName}
              </div>
              <ul>
                {fileFunctions.map((func) => (
                  <li key={func.id}>
                    <button
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-100 transition-colors flex items-center ${
                        selectedFunction?.id === func.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                      onClick={() => onSelectFunction(func)}
                    >
                      <span className="font-mono">
                        {func.name}
                        <span className="text-slate-500">({func.parameters.length})</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FunctionList;
