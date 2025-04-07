
export interface DocumentationParameter {
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
  returns: string;
}
