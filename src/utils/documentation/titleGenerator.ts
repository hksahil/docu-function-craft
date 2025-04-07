
export function generateTitle(functionName: string): string {
  return `${formatFunctionName(functionName)} Function Documentation`;
}

export function formatFunctionName(name: string): string {
  // Convert snake_case to Title Case Words
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
