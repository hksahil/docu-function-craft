
import { PythonFunction, PythonParameter } from "@/types/pythonTypes";
import { DocumentationParameter } from "./types";

export function analyzeParameters(params: PythonParameter[], func?: PythonFunction): DocumentationParameter[] {
  // If we have a function with a docstring, try to extract parameter descriptions from it
  if (func?.docstring) {
    const docstring = func.docstring;
    const paramDescriptions = extractParamDescriptionsFromDocstring(docstring);
    
    return params.map(param => {
      // Clean up type string
      let typeStr = param.type || 'Any';
      typeStr = typeStr.replace(/Optional\[(.*)\]/, '$1 (Optional)');
      
      // Use docstring description if available
      const docDescription = paramDescriptions[param.name];
      
      if (docDescription) {
        // Parse the docstring parameter description to separate type and description
        const typeAndDesc = parseParameterDocstring(docDescription);
        
        if (typeAndDesc.type) {
          // Use the type from docstring if available
          return {
            name: param.name,
            type: typeAndDesc.type,
            description: typeAndDesc.description + (param.isOptional ? ` (optional, default: ${param.default})` : '')
          };
        }
        
        return {
          name: param.name,
          type: typeStr,
          description: docDescription + (param.isOptional ? ` (optional, default: ${param.default})` : '')
        };
      }
      
      // Fall back to auto-generated description
      return generateParameterDescription(param, typeStr);
    });
  }
  
  // Fall back to the original auto-generation for each parameter
  return params.map(param => {
    const typeStr = param.type || 'Any';
    return generateParameterDescription(param, typeStr);
  });
}

// Parse parameter docstring to extract type and description
function parseParameterDocstring(docstring: string): { type: string | null, description: string } {
  // Match patterns like "(pd.DataFrame): Sales DataFrame" or "Sales DataFrame"
  const match = docstring.match(/^\s*\(([^)]+)\):\s*(.*)/);
  if (match) {
    return {
      type: match[1].trim(),
      description: match[2].trim()
    };
  }
  return { type: null, description: docstring };
}

function extractParamDescriptionsFromDocstring(docstring: string): Record<string, string> {
  const paramDescriptions: Record<string, string> = {};
  
  // Look for Args: or Parameters: sections in docstring
  const argsMatch = docstring.match(/(?:Args|Parameters):([\s\S]*?)(?:\n\s*\n|\nReturns:|\nExample:|\nRaises:|\nNotes:|\nYields:|$)/i);
  
  if (argsMatch && argsMatch[1]) {
    const argsSection = argsMatch[1];
    
    // Match patterns like: "param_name (type): description" or "param_name: description"
    const paramRegex = /\n\s*([a-zA-Z0-9_]+)(\s*\([^)]+\))?:\s*([\s\S]*?)(?=\n\s*[a-zA-Z0-9_]+(?:\s*\([^)]+\))?:|\n\s*\n|\n\s*$|$)/g;
    
    let match;
    while ((match = paramRegex.exec(argsSection)) !== null) {
      const [_, paramName, paramType, description] = match;
      // Store the complete parameter description with type if available
      if (paramType) {
        paramDescriptions[paramName] = `${paramType}:${description.trim()}`;
      } else {
        paramDescriptions[paramName] = description.trim();
      }
    }
  }
  
  return paramDescriptions;
}

function generateParameterDescription(param: PythonParameter, typeStr: string): DocumentationParameter {
  // Convert parameter name to a readable description
  const nameWords = param.name.split('_');
  const readableName = nameWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
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
  } else if (typeStr.includes('float')) {
    description += 'specifying a decimal value';
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
}
