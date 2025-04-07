
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface ChatGptSettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const ChatGptSettings = ({ open, onClose, onSave }: ChatGptSettingsProps) => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    onSave(apiKey);
    onClose();
    
    toast({
      title: "Settings saved",
      description: "Your OpenAI API key has been saved",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>ChatGPT Settings</SheetTitle>
          <SheetDescription>
            Enter your OpenAI API key to use ChatGPT for generating documentation.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              OpenAI API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored only in your browser's local storage and is never sent to our servers.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatGptSettings;
