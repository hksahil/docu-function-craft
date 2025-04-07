
import { PythonFunction } from "@/types/pythonTypes";
import { Documentation } from "@/utils/documentation/types";
import { generateTitle } from "@/utils/documentation/titleGenerator";
import { generateDescription } from "@/utils/documentation/descriptionGenerator";
import { analyzeFunctionality } from "@/utils/documentation/functionalityAnalyzer";
import { analyzeParameters } from "@/utils/documentation/parameterAnalyzer";
import { generateSteps } from "@/utils/documentation/stepsGenerator";

class DocumentationGenerator {
  static generateDocumentation(pythonFunction: PythonFunction): Documentation {
    const title = generateTitle(pythonFunction.name);
    const description = generateDescription(pythonFunction);
    const functionality = analyzeFunctionality(pythonFunction);
    const parameters = analyzeParameters(pythonFunction);
    const steps = generateSteps(pythonFunction);

    return {
      title,
      description,
      functionality,
      parameters,
      steps,
    };
  }
}

export default DocumentationGenerator;
