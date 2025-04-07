
import { PythonFunction } from "@/types/pythonTypes";

export function generateSteps(func: PythonFunction): string[] {
  const code = func.code;
  const lines = code.split('\n').map(line => line.trim()).filter(line => line);
  
  // Skip the function definition line and any docstring
  let codeLines: string[] = [];
  let inDocstring = false;
  let docstringEnded = false;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip docstring
    if (!docstringEnded && !inDocstring && (line.startsWith('"""') || line.startsWith("'''"))) {
      inDocstring = true;
      if (line.endsWith('"""') || line.endsWith("'''")) {
        inDocstring = false;
        docstringEnded = true;
      }
      continue;
    }
    
    if (inDocstring) {
      if (line.endsWith('"""') || line.endsWith("'''")) {
        inDocstring = false;
        docstringEnded = true;
      }
      continue;
    }
    
    codeLines.push(line);
  }
  
  const steps: string[] = [];
  
  // Extract comments as steps
  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i];
    
    // Check for comments that might indicate steps
    if (line.includes('#')) {
      const commentPart = line.split('#')[1].trim();
      if (commentPart && commentPart.length > 3) { // Ensure comment has some meaningful content
        steps.push(commentPart);
      }
    }
  }
  
  // If not enough steps from comments, analyze code structure
  if (steps.length < 2) {
    let currentBlock = '';
    
    for (let i = 0; i < codeLines.length; i++) {
      const line = codeLines[i];
      
      // Check for significant code patterns
      if (line.startsWith('for ') || line.startsWith('while ')) {
        steps.push(`Iterate through ${line.includes('for ') ? 'items' : 'conditions'} to process data.`);
      } else if (line.startsWith('if ') && !line.startsWith('elif ') && !line.startsWith('else:')) {
        steps.push('Evaluate conditions to determine processing path.');
      } else if (line.startsWith('try:')) {
        steps.push('Attempt operations with error handling.');
      } else if (line.startsWith('return ')) {
        steps.push('Return the processed results.');
      }
    }
  }
  
  // If we still couldn't determine meaningful steps, create generic ones
  if (steps.length === 0) {
    steps.push(`Initialize processing for ${func.name.replace(/_/g, ' ')}.`);
    
    if (func.parameters.length > 0) {
      steps.push(`Process input parameters: ${func.parameters.map(p => p.name).join(', ')}.`);
    }
    
    steps.push(`Perform core functionality and return results.`);
  }
  
  return steps;
}
