
import { PythonFunction } from "@/types/pythonTypes";

export function generateSteps(func: PythonFunction): string[] {
  const code = func.code;
  const lines = code.split('\n').map(line => line.trim()).filter(line => line);
  
  // Skip the function definition line
  const codeLines = lines.slice(1);
  
  const steps: string[] = [];
  
  // Analyze the code structure to identify logical steps
  let currentStep = '';
  let stepCount = 1;
  
  // Simple heuristic: look for comment lines or significant code patterns
  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i];
    
    // Check for comments that might indicate steps
    if (line.startsWith('#')) {
      if (currentStep) {
        steps.push(`${stepCount}. ${currentStep}`);
        stepCount++;
        currentStep = '';
      }
      currentStep = line.substring(1).trim();
      continue;
    }
    
    // Check for significant code patterns
    if (line.startsWith('for ') || line.startsWith('while ')) {
      if (currentStep) {
        steps.push(`${stepCount}. ${currentStep}`);
        stepCount++;
      }
      currentStep = `Iterate through ${line.includes('for ') ? 'items' : 'conditions'} to process data.`;
    } else if (line.startsWith('if ') && !line.startsWith('elif ') && !line.startsWith('else:')) {
      if (currentStep) {
        steps.push(`${stepCount}. ${currentStep}`);
        stepCount++;
      }
      currentStep = 'Evaluate conditions to determine processing path.';
    } else if (line.startsWith('try:')) {
      if (currentStep) {
        steps.push(`${stepCount}. ${currentStep}`);
        stepCount++;
      }
      currentStep = 'Attempt operations with error handling.';
    } else if (line.startsWith('return ')) {
      if (currentStep) {
        steps.push(`${stepCount}. ${currentStep}`);
        stepCount++;
      }
      currentStep = 'Return the processed results.';
    }
  }
  
  // Add the last step if there is one
  if (currentStep) {
    steps.push(`${stepCount}. ${currentStep}`);
  }
  
  // If we couldn't determine steps, create generic ones
  if (steps.length === 0) {
    steps.push(`1. Initialize processing for ${func.name.replace(/_/g, ' ')}.`);
    
    if (func.parameters.length > 0) {
      steps.push(`2. Process input parameters: ${func.parameters.map(p => p.name).join(', ')}.`);
    }
    
    steps.push(`${func.parameters.length > 0 ? 3 : 2}. Perform core functionality and return results.`);
  }
  
  return steps;
}
