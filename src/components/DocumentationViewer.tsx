
import { useState } from "react";
import { PythonFunction } from "@/types/pythonTypes";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Code, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CodeViewer from "@/components/CodeViewer";
import DocumentationGenerator from "@/utils/documentationGenerator";
import { downloadAsWord } from "@/utils/exportUtils";

interface DocumentationViewerProps {
  pythonFunction: PythonFunction | null;
  allFunctions: PythonFunction[];
}

const DocumentationViewer = ({ pythonFunction, allFunctions }: DocumentationViewerProps) => {
  const [activeTab, setActiveTab] = useState("documentation");
  const { toast } = useToast();

  if (!pythonFunction) {
    return (
      <Card className="p-8 text-center h-[600px] flex items-center justify-center">
        <div>
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No Function Selected</h3>
          <p className="text-gray-400">
            Upload Python files and select a function to view its documentation
          </p>
        </div>
      </Card>
    );
  }

  const documentation = DocumentationGenerator.generateDocumentation(pythonFunction);

  const handleDownloadWord = () => {
    downloadAsWord(allFunctions, pythonFunction);
    toast({
      title: "Documentation downloaded",
      description: `Complete Python documentation has been downloaded`,
    });
  };

  return (
    <Card>
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono">{pythonFunction.name}</h2>
          <p className="text-gray-500 text-sm">From: {pythonFunction.fileName}</p>
        </div>
        <Button 
          variant="outline" 
          className="flex gap-2 items-center" 
          onClick={handleDownloadWord}
        >
          <Download className="h-4 w-4" />
          Download Documentation
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documentation" className="flex gap-2">
              <FileText className="h-4 w-4" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="code" className="flex gap-2">
              <Code className="h-4 w-4" />
              Source Code
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="documentation" className="p-6">
          <div className="prose max-w-none">
            <h1>{documentation.title}</h1>
            <p className="text-gray-700">{documentation.description}</p>
            
            <h2>Functionality</h2>
            <ul>
              {documentation.functionality.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h2>Parameters</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {documentation.parameters.map((param, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="border p-2 font-mono">{param.name}</td>
                      <td className="border p-2 text-gray-600">{param.type || "Any"}</td>
                      <td className="border p-2">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <h2>Processing Steps</h2>
            <ol>
              {documentation.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            
            <h2>Returns</h2>
            <p>{documentation.returns}</p>
          </div>
        </TabsContent>

        <TabsContent value="code">
          <CodeViewer code={pythonFunction.code} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DocumentationViewer;
