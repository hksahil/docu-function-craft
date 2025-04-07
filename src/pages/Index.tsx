
import { useState, useEffect } from "react";
import FileUploader from "@/components/FileUploader";
import FunctionList from "@/components/FunctionList";
import DocumentationViewer from "@/components/DocumentationViewer";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { PythonFunction } from "@/types/pythonTypes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ChatGptSettings from "@/components/ChatGptSettings";
import { Zap } from "lucide-react";

const Index = () => {
  const [pythonFunctions, setPythonFunctions] = useState<PythonFunction[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<PythonFunction | null>(null);
  const [useChatGpt, setUseChatGpt] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [chatGptApiKey, setChatGptApiKey] = useState<string>(() => {
    const storedKey = localStorage.getItem("openai-api-key");
    return storedKey || "";
  });
  const { toast } = useToast();

  useEffect(() => {
    if (chatGptApiKey) {
      localStorage.setItem("openai-api-key", chatGptApiKey);
    }
  }, [chatGptApiKey]);

  const handleFunctionsExtracted = (functions: PythonFunction[]) => {
    setPythonFunctions(functions);
    toast({
      title: "Files processed successfully",
      description: `Extracted ${functions.length} Python functions`,
    });
    
    if (functions.length > 0 && !selectedFunction) {
      setSelectedFunction(functions[0]);
    }
  };

  const handleToggleChatGpt = (checked: boolean) => {
    setUseChatGpt(checked);
    if (checked && !chatGptApiKey) {
      setShowSettings(true);
    }
  };

  const handleSaveApiKey = (apiKey: string) => {
    setChatGptApiKey(apiKey);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="use-chatgpt" 
                  checked={useChatGpt}
                  onCheckedChange={handleToggleChatGpt}
                />
                <Label htmlFor="use-chatgpt" className="flex items-center cursor-pointer">
                  <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                  Use ChatGPT
                </Label>
              </div>
            </div>
            
            <FileUploader onFunctionsExtracted={handleFunctionsExtracted} />
            <FunctionList 
              functions={pythonFunctions} 
              selectedFunction={selectedFunction}
              onSelectFunction={setSelectedFunction}
            />
          </div>
          <div className="md:col-span-9">
            <DocumentationViewer 
              pythonFunction={selectedFunction}
              allFunctions={pythonFunctions}
              useChatGpt={useChatGpt}
              chatGptApiKey={chatGptApiKey}
              onRequestApiKey={() => setShowSettings(true)}
            />
          </div>
        </div>
      </main>
      
      <ChatGptSettings 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
};

export default Index;
