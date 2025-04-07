
import { PythonFunction } from "@/types/pythonTypes";

export function generateDescription(pythonFunction: PythonFunction): string {
  const docstring = pythonFunction.docstring || "";
  
  if (docstring) {
    // Extract the first paragraph from the docstring as the description
    const firstParagraph = docstring.split('\n\n')[0].trim();
    return firstParagraph || `Function for ${pythonFunction.name.replace(/_/g, ' ')}`;
  }
  
  // Generate a generic description if no docstring is available
  const formattedName = pythonFunction.name.replace(/_/g, ' ');
  return `A Python function named ${formattedName} that processes the given inputs and returns results based on the specified parameters.`;
}
