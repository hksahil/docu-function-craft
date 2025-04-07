
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import FunctionList from "@/components/FunctionList";
import DocumentationViewer from "@/components/DocumentationViewer";
import Header from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
import { PythonFunction } from "@/types/pythonTypes";

const Index = () => {
  const [pythonFunctions, setPythonFunctions] = useState<PythonFunction[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<PythonFunction | null>(null);
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
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
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
