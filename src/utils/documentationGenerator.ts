
import { PythonFunction } from "@/types/pythonTypes";
import { Documentation } from "./documentation/types";
import { generateTitle } from "./documentation/titleGenerator";
import { generateDescription } from "./documentation/descriptionGenerator";
import { generateFunctionality } from "./documentation/functionalityAnalyzer";
import { generateParameterDescriptions } from "./documentation/parameterAnalyzer";
import { generateProcessingSteps } from "./documentation/stepsGenerator";

class DocumentationGenerator {
  static generateDocumentation(func: PythonFunction): Documentation {
    // Generate title (Function name + purpose)
    const title = generateTitle(func.name);
    
    // Generate description
    const description = generateDescription(func);
    
    // Generate functionality points
    const functionality = generateFunctionality(func);
    
    // Generate parameter descriptions
    const parameters = generateParameterDescriptions(func.parameters);
    
    // Generate processing steps
    const steps = generateProcessingSteps(func);
    
    return {
      title,
      description,
      functionality,
      parameters,
      steps
    };
  }
}

export default DocumentationGenerator;
export type { Documentation } from "./documentation/types";
export type { DocumentationParameter } from "./documentation/types";
