
import { PythonFunction, PythonParameter } from "@/types/pythonTypes";
import { v4 as uuidv4 } from "uuid";

export function extractFunctionsFromCode(code: string, fileName: string): PythonFunction[] {
  const functions: PythonFunction[] = [];
  
  // Regular expression to match Python function definitions
  const functionRegex = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([\s\S]*?)\)(?:\s*->[\s\S]*?)?:\s*([\s\S]*?)(?=\n\S|$)/g;
  
  let match;
  while ((match = functionRegex.exec(code)) !== null) {
    const [fullMatch, funcName, paramsString, bodyContent] = match;
    
    // Extract docstring if present
    let docstring = null;
    const docstringRegex = /^\s*(?:\'\'\'([\s\S]*?)\'\'\'|\"\"\"([\s\S]*?)\"\"\")/;
    const docstringMatch = bodyContent.match(docstringRegex);
    if (docstringMatch) {
      docstring = (docstringMatch[1] || docstringMatch[2]).trim();
    }
    
    // Parse parameters
    const parameters = parseParameters(paramsString);
    
    // Create function object
    const functionObj: PythonFunction = {
      id: uuidv4(),
      name: funcName,
      code: fullMatch.trim(),
      parameters,
      docstring,
      fileName
    };
    
    functions.push(functionObj);
  }
  
  return functions;
}

function parseParameters(paramsString: string): PythonParameter[] {
  if (!paramsString.trim()) {
    return [];
  }
  
  const params: PythonParameter[] = [];
  
  // Split by commas but respect nested structures
  const paramsList = paramsString.split(',').map(p => p.trim());
  
  for (const param of paramsList) {
    if (!param || param === 'self' || param === 'cls') continue;
    
    // Check for default value
    const hasDefaultValue = param.includes('=');
    let paramName = param;
    let paramType = undefined;
    let defaultValue = undefined;
    
    if (hasDefaultValue) {
      const [nameTypePart, valuePart] = param.split('=').map(p => p.trim());
      defaultValue = valuePart;
      paramName = nameTypePart;
    }
    
    // Check for type annotation
    if (paramName.includes(':')) {
      const [name, type] = paramName.split(':').map(p => p.trim());
      paramName = name;
      paramType = type;
    }
    
    params.push({
      name: paramName,
      type: paramType,
      default: defaultValue,
      isOptional: hasDefaultValue
    });
  }
  
  return params;
}
