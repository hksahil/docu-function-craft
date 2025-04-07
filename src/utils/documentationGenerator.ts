
import { PythonFunction } from "@/types/pythonTypes";
import { Documentation } from "@/utils/documentation/types";
import { generateTitle } from "@/utils/documentation/titleGenerator";
import { generateDescription } from "@/utils/documentation/descriptionGenerator";
import { analyzeFunctionality } from "@/utils/documentation/functionalityAnalyzer";
import { analyzeParameters } from "@/utils/documentation/parameterAnalyzer";
import { generateSteps } from "@/utils/documentation/stepsGenerator";
import { analyzeReturns } from "@/utils/documentation/returnsAnalyzer";

class DocumentationGenerator {
  static generateDocumentation(pythonFunction: PythonFunction): Documentation {
    const title = generateTitle(pythonFunction.name);
    const description = generateDescription(pythonFunction);
    const functionality = analyzeFunctionality(pythonFunction);
    const parameters = analyzeParameters(pythonFunction.parameters);
    const steps = generateSteps(pythonFunction);
    const returns = analyzeReturns(pythonFunction);

    return {
      title,
      description,
      functionality,
      parameters,
      steps,
      returns,
    };
  }
}

export default DocumentationGenerator;
