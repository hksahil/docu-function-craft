
import { PythonFunction } from "@/types/pythonTypes";

export function analyzeReturns(func: PythonFunction): string {
  // Check if docstring has a Returns section
  if (func.docstring) {
    const returnsMatch = func.docstring.match(/Returns:([\s\S]*?)(?:\n\s*\n|\nExample:|\nRaises:|\nNotes:|\nYields:|$)/i);
    
    if (returnsMatch && returnsMatch[1]) {
      return returnsMatch[1].trim();
    }
  }
  
  // If no returns info in docstring, analyze code
  const code = func.code;
  
  // Look for return statements in the code
  const returnRegex = /\breturn\b\s+(.*?)(?:$|#)/gm;
  const returnMatches = [...code.matchAll(returnRegex)];
  
  if (returnMatches.length > 0) {
    // Try to determine the return type or value
    const lastReturn = returnMatches[returnMatches.length - 1][1].trim();
    
    if (lastReturn.includes("dict") || lastReturn.startsWith("{")) {
      return "Returns a dictionary containing the processed data.";
    } else if (lastReturn.includes("list") || lastReturn.startsWith("[")) {
      return "Returns a list of processed elements.";
    } else if (lastReturn.includes("True") || lastReturn.includes("False")) {
      return "Returns a boolean indicating success or failure of the operation.";
    } else if (!isNaN(Number(lastReturn))) {
      return "Returns a numeric value representing the computation result.";
    } else if (lastReturn.includes("str") || (lastReturn.startsWith('"') || lastReturn.startsWith("'"))) {
      return "Returns a string representation of the processed data.";
    } else {
      return "Returns the result of processing the input parameters.";
    }
  }
  
  // If no return statements found or can't determine return type
  return "Returns the result of the computation.";
}
