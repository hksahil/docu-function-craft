
import { PythonParameter } from "@/types/pythonTypes";
import { DocumentationParameter } from "./types";

export function generateParameterDescriptions(params: PythonParameter[]): DocumentationParameter[] {
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
