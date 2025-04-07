
export interface PythonParameter {
  name: string;
  type?: string;
  default?: string;
  isOptional: boolean;
}

export interface PythonFunction {
  id: string;
  name: string;
  code: string;
  parameters: PythonParameter[];
  docstring?: string;
  fileName: string;
}
