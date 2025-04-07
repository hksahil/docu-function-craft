
import { FileText, Book } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-slate-900 text-white py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">DocuFunction</h1>
            <p className="text-sm text-slate-300">Python Function Documentation Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-blue-400" />
          <span className="text-sm">Generate clean docs for your Python functions</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
