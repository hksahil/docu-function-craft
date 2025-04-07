
import { saveAs } from 'file-saver';
import * as docx from 'docx';
import { PythonFunction } from '@/types/pythonTypes';
import { Documentation } from '@/utils/documentation/types';

export function downloadAsWord(pythonFunction: PythonFunction, documentation: Documentation): void {
  // Create a new document
  const doc = new docx.Document({
    sections: [{
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
            text: step,
            numbering: {
              reference: "my-numbering",
              level: 0,
            },
            spacing: {
              after: 100,
            },
          })
        ),
        new docx.Paragraph({
          text: "Source Code",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: {
            after: 200,
            before: 200,
          },
        }),
        new docx.Paragraph({
          text: pythonFunction.code,
          style: "CodeBlock",
          spacing: {
            after: 200,
          },
        }),
      ],
    }],
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
    // Save the blob as a file
    saveAs(blob, `${pythonFunction.name}.docx`);
  });
}
