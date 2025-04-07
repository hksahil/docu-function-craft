
import { PythonFunction } from "@/types/pythonTypes";

export function generateFunctionality(func: PythonFunction): string[] {
  // Basic analysis of code to determine functionality
  const code = func.code.toLowerCase();
  const functionality: string[] = [];
  
  // Check for common patterns
  if (code.includes('json.loads') || code.includes('json.dumps')) {
    functionality.push('Processes JSON data for serialization or deserialization.');
  }
  
  if (code.includes('for ') && code.includes('in ')) {
    functionality.push('Iterates through collections to process multiple items.');
  }
  
  if (code.includes('try') && code.includes('except')) {
    functionality.push('Implements error handling for robust execution.');
  }
  
  if (code.includes('logging.')) {
    functionality.push('Provides logging for debugging and monitoring.');
  }
  
  if (code.includes('return ')) {
    functionality.push('Returns processed data to the caller.');
  }
  
  if (code.includes('dict(') || code.includes('{}')) {
    functionality.push('Organizes data using dictionary structures.');
  }
  
  if (code.includes('list(') || code.includes('[]')) {
    functionality.push('Manages collections of data using lists.');
  }
  
  // If we couldn't determine any functionality, add a generic one
  if (functionality.length === 0) {
    functionality.push(`Processes input parameters to perform ${func.name.replace(/_/g, ' ')} operations.`);
    functionality.push('Returns results based on the given inputs.');
  }
  
  return functionality;
}
