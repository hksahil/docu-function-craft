
import { saveAs } from 'file-saver';
import * as docx from 'docx';
import { PythonFunction } from '@/types/pythonTypes';
import { Documentation } from '@/utils/documentation/types';
import DocumentationGenerator from '@/utils/documentationGenerator';

export function downloadAsWord(pythonFunctions: PythonFunction[], selectedFunction: PythonFunction | null): void {
  // Create a document with all functions, but start with the selected one if any
  const allFunctions = selectedFunction 
    ? [selectedFunction, ...pythonFunctions.filter(f => f.id !== selectedFunction.id)]
    : pythonFunctions;
    
  // Generate sections for all functions
  const sections = allFunctions.map(pythonFunction => {
    const documentation = DocumentationGenerator.generateDocumentation(pythonFunction);
    
    // Extract just the function signature
    const functionSignature = extractFunctionSignature(pythonFunction.code);
    
    return {
      properties: {},
      children: [
        new docx.Paragraph({
          text: documentation.title,
          heading: docx.HeadingLevel.HEADING_1,
          spacing: {
            after: 200,
          },
        }),
        new docx.Paragraph({
          text: documentation.description,
          spacing: {
            after: 200,
          },
        }),
        new docx.Paragraph({
          text: "Functionality",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: {
            after: 200,
          },
        }),
        ...documentation.functionality.map(item => 
          new docx.Paragraph({
            text: item,
            bullet: {
              level: 0,
            },
            spacing: {
              after: 100,
            },
          })
        ),
        new docx.Paragraph({
          text: "Parameters",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: {
            after: 200,
            before: 200,
          },
        }),
        ...documentation.parameters.map(param => 
          new docx.Paragraph({
            text: `${param.name} (${param.type || "Any"}): ${param.description}`,
            bullet: {
              level: 0,
            },
            spacing: {
              after: 100,
            },
          })
        ),
        new docx.Paragraph({
          text: "Processing Steps",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: {
            after: 200,
            before: 200,
          },
        }),
        ...documentation.steps.map((step, index) => 
          new docx.Paragraph({
            text: `${step}`,
            spacing: {
              after: 100,
            },
          })
        ),
        new docx.Paragraph({
          text: "Returns",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: {
            after: 200,
            before: 200,
          },
        }),
        new docx.Paragraph({
          text: documentation.returns,
          spacing: {
            after: 200,
          },
        }),
        new docx.Paragraph({
          text: "Source Code",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: {
            after: 200,
            before: 200,
          },
        }),
        // Only show the function signature
        new docx.Paragraph({
          text: functionSignature,
          style: "CodeBlock",
          spacing: {
            after: 200,
          },
        }),
        // Add a separator between functions (except for the last one)
        new docx.Paragraph({
          text: "",
          spacing: {
            after: 400,
          },
        }),
      ],
    };
  });

  // Create a new document with all sections
  const doc = new docx.Document({
    sections,
    numbering: {
      config: [{
        reference: "my-numbering",
        levels: [
          {
            level: 0,
            format: docx.LevelFormat.DECIMAL,
            text: "%1.",
            alignment: docx.AlignmentType.START,
            style: {
              run: {
                bold: true,
              },
            },
          },
        ],
      }],
    },
    styles: {
      paragraphStyles: [
        {
          id: "CodeBlock",
          name: "Code Block",
          basedOn: "Normal",
          run: {
            font: "Courier New",
            size: 20,
          },
          paragraph: {
            spacing: {
              line: 360,
            },
          },
        },
      ],
    },
  });

  // Create a blob from the document
  docx.Packer.toBlob(doc).then(blob => {
    // Save the blob as a file with project name
    saveAs(blob, `python_documentation.docx`);
  });
}

// Helper function to extract just the function signature
function extractFunctionSignature(code: string): string {
  const lines = code.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('def ')) {
      return line.trim();
    }
  }
  return '';
}
