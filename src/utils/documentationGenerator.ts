
import { PythonFunction, PythonParameter } from "@/types/pythonTypes";

interface DocumentationParameter {
  name: string;
  type: string;
  description: string;
}

export interface Documentation {
  title: string;
  description: string;
  functionality: string[];
  parameters: DocumentationParameter[];
  steps: string[];
}

class DocumentationGenerator {
  static generateDocumentation(func: PythonFunction): Documentation {
    // Generate title (Function name + purpose)
    const title = this.generateTitle(func);
    
    // Generate description
    const description = this.generateDescription(func);
    
    // Generate functionality points
    const functionality = this.generateFunctionality(func);
    
    // Generate parameter descriptions
    const parameters = this.generateParameterDescriptions(func.parameters);
    
    // Generate processing steps
    const steps = this.generateProcessingSteps(func);
    
    return {
      title,
      description,
      functionality,
      parameters,
      steps
    };
  }
  
  private static generateTitle(func: PythonFunction): string {
    return `${this.formatFunctionName(func.name)} Function Documentation`;
  }
  
  private static formatFunctionName(name: string): string {
    // Convert snake_case to Title Case Words
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  private static generateDescription(func: PythonFunction): string {
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
  
  private static generateFunctionality(func: PythonFunction): string[] {
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
  
  private static generateParameterDescriptions(params: PythonParameter[]): DocumentationParameter[] {
    return params.map(param => {
      // Convert parameter name to a readable description
      const nameWords = param.name.split('_');
      const readableName = nameWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      let typeStr = param.type || 'Any';
      // Clean up type string
      typeStr = typeStr.replace(/Optional\[(.*)\]/, '$1 (Optional)');
      
      // Generate a meaningful description based on name and type
      let description = `${readableName} `;
      
      if (param.isOptional) {
        description += `(optional, default: ${param.default}) `;
      }
      
      // Add type-specific description
      if (typeStr.includes('str')) {
        description += 'containing text information';
      } else if (typeStr.includes('int')) {
        description += 'specifying a numeric value';
      } else if (typeStr.includes('bool')) {
        description += 'indicating whether to enable this feature';
      } else if (typeStr.includes('list') || typeStr.includes('List')) {
        description += 'containing multiple items';
      } else if (typeStr.includes('dict') || typeStr.includes('Dict')) {
        description += 'with key-value configuration';
      } else if (typeStr.includes('Callable')) {
        description += 'function to be executed';
      } else {
        description += 'for processing';
      }
      
      description += '.';
      
      return {
        name: param.name,
        type: typeStr,
        description
      };
    });
  }
  
  private static generateProcessingSteps(func: PythonFunction): string[] {
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
}

export default DocumentationGenerator;
