
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileCode, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PythonFunction } from "@/types/pythonTypes";
import { extractFunctionsFromCode } from "@/utils/pythonParser";

interface FileUploaderProps {
  onFunctionsExtracted: (functions: PythonFunction[]) => void;
}

const FileUploader = ({ onFunctionsExtracted }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.name.endsWith('.py')
    );
    
    if (files.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please upload only Python (.py) files",
        variant: "destructive"
      });
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => 
        file.name.endsWith('.py')
      );
      
      if (files.length === 0) {
        toast({
          title: "Invalid files",
          description: "Please upload only Python (.py) files",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files to process",
        description: "Please upload Python files first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const allFunctions: PythonFunction[] = [];

    try {
      for (const file of uploadedFiles) {
        const text = await file.text();
        const extractedFunctions = extractFunctionsFromCode(text, file.name);
        allFunctions.push(...extractedFunctions);
      }

      onFunctionsExtracted(allFunctions);
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Processing error",
        description: "An error occurred while processing your files",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileCode className="h-5 w-5 text-blue-600" />
          Upload Python Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">
            Drag and drop your Python files here
          </p>
          <p className="text-xs text-gray-500">or click to browse</p>
          <input
            id="file-upload"
            type="file"
            accept=".py"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Uploaded Files ({uploadedFiles.length})</h3>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between bg-slate-100 rounded p-2 text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <Button 
              onClick={processFiles} 
              className="w-full mt-4"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Process Files"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
