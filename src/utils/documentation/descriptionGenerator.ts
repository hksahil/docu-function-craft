
import { PythonFunction } from "@/types/pythonTypes";

export function generateDescription(func: PythonFunction): string {
  if (func.docstring) {
    return func.docstring;
  }
  
  const nameWords = func.name.split('_');
  
  // Analyze function name to determine purpose
  const actionWords = ['get', 'fetch', 'parse', 'process', 'format', 'convert', 'validate', 'calculate', 'create'];
  const action = nameWords.find(word => actionWords.includes(word)) || nameWords[0];
  
  const objectWords = nameWords.filter(word => word !== action);
  const objectPhrase = objectWords.join(' ');
  
  return `This function ${action}s ${objectPhrase} and performs operations based on the provided parameters.`;
}
