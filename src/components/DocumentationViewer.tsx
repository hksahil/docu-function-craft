
import { useState, useEffect } from "react";
import { PythonFunction } from "@/types/pythonTypes";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Code, FileText, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CodeViewer from "@/components/CodeViewer";
import DocumentationGenerator from "@/utils/documentationGenerator";
import { downloadAsWord } from "@/utils/exportUtils";
import { Documentation } from "@/utils/documentation/types";
import { generateDocumentationWithGpt } from "@/utils/chatGptService";

interface DocumentationViewerProps {
  pythonFunction: PythonFunction | null;
  allFunctions: PythonFunction[];
  useChatGpt?: boolean;
  chatGptApiKey?: string;
  onRequestApiKey?: () => void;
}

const DocumentationViewer = ({ 
  pythonFunction, 
  allFunctions, 
  useChatGpt = false,
  chatGptApiKey = "",
  onRequestApiKey
}: DocumentationViewerProps) => {
  const [activeTab, setActiveTab] = useState("documentation");
  const [documentation, setDocumentation] = useState<Documentation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!pythonFunction) {
      setDocumentation(null);
      return;
    }

    const generateDocumentation = async () => {
      if (useChatGpt && chatGptApiKey) {
        setIsLoading(true);
        try {
          const gptDocumentation = await generateDocumentationWithGpt(pythonFunction, chatGptApiKey);
          if (gptDocumentation) {
            setDocumentation(gptDocumentation);
          } else {
            // Fall back to local generation if GPT fails
            const localDocumentation = DocumentationGenerator.generateDocumentation(pythonFunction);
            setDocumentation(localDocumentation);
            toast({
              title: "Failed to generate with ChatGPT",
              description: "Falling back to local documentation generation",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error generating documentation with ChatGPT:", error);
          const localDocumentation = DocumentationGenerator.generateDocumentation(pythonFunction);
          setDocumentation(localDocumentation);
          toast({
            title: "Error",
            description: "Failed to generate documentation with ChatGPT",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // Use local documentation generator
        const localDocumentation = DocumentationGenerator.generateDocumentation(pythonFunction);
        setDocumentation(localDocumentation);
      }
    };

    generateDocumentation();
  }, [pythonFunction, useChatGpt, chatGptApiKey, toast]);

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

  const handleRefreshWithGPT = async () => {
    if (!useChatGpt) {
      if (onRequestApiKey) {
        onRequestApiKey();
      }
      return;
    }

    if (!chatGptApiKey) {
      if (onRequestApiKey) {
        onRequestApiKey();
      }
      toast({
        title: "API Key Required",
        description: "Please provide your OpenAI API key in settings",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const gptDocumentation = await generateDocumentationWithGpt(pythonFunction, chatGptApiKey);
      if (gptDocumentation) {
        setDocumentation(gptDocumentation);
        toast({
          title: "Documentation Updated",
          description: "Successfully generated documentation with ChatGPT",
        });
      } else {
        toast({
          title: "Failed",
          description: "Could not generate documentation with ChatGPT",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error refreshing documentation with ChatGPT:", error);
      toast({
        title: "Error",
        description: "Failed to update documentation with ChatGPT",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadWord = () => {
    downloadAsWord(allFunctions, pythonFunction);
    toast({
      title: "Documentation downloaded",
      description: `Complete Python documentation has been downloaded`,
    });
  };

  if (!documentation) {
    return (
      <Card className="p-8 text-center h-[600px] flex items-center justify-center">
        <div>
          <RefreshCw className={`h-16 w-16 mx-auto text-gray-300 mb-4 ${isLoading ? 'animate-spin' : ''}`} />
          <h3 className="text-xl font-medium text-gray-500 mb-2">Generating Documentation</h3>
          <p className="text-gray-400">
            Please wait while we process the function...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono">{pythonFunction.name}</h2>
          <p className="text-gray-500 text-sm">From: {pythonFunction.fileName}</p>
        </div>
        <div className="flex gap-2">
          {useChatGpt && (
            <Button 
              variant="outline" 
              className="flex gap-2 items-center" 
              onClick={handleRefreshWithGPT}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh with GPT
            </Button>
          )}
          <Button 
            variant="outline" 
            className="flex gap-2 items-center" 
            onClick={handleDownloadWord}
          >
            <Download className="h-4 w-4" />
            Download Documentation
          </Button>
        </div>
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
