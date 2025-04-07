
import { saveAs } from 'file-saver';
import { PythonFunction } from '@/types/pythonTypes';
import DocumentationGenerator, { Documentation } from './documentationGenerator';

export const downloadAsWord = async (
  pythonFunction: PythonFunction,
  documentation: Documentation
) => {
  try {
    // Dynamically import the docx library
    const docx = await import('docx');
    
    // Create document
    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: [],
      }],
    });

    // Function for creating heading paragraphs
    const createHeading = (text: string, level: typeof docx.HeadingLevel) => {
      return new docx.Paragraph({
        text,
        heading: level,
        spacing: {
          after: 200,
        },
      });
    };

    // Create title and description
    const title = createHeading(documentation.title, docx.HeadingLevel.HEADING_1);
    
    const descriptionPara = new docx.Paragraph({
      children: [new docx.TextRun(documentation.description)],
      spacing: {
        after: 200,
      },
    });

    // Create functionality section
    const functionalityTitle = createHeading("Functionality", docx.HeadingLevel.HEADING_2);
    
    const functionalityItems = documentation.functionality.map(
      (item) =>
        new docx.Paragraph({
          text: item,
          bullet: {
            level: 0,
          },
          spacing: {
            after: 100,
          },
        })
    );

    // Create parameters table
    const parametersTitle = createHeading("Parameters", docx.HeadingLevel.HEADING_2);
    
    const tableRows = [
      new docx.TableRow({
        children: [
          new docx.TableCell({
            children: [new docx.Paragraph("Name")],
            shading: {
              fill: "D3D3D3",
            },
          }),
          new docx.TableCell({
            children: [new docx.Paragraph("Type")],
            shading: {
              fill: "D3D3D3",
            },
          }),
          new docx.TableCell({
            children: [new docx.Paragraph("Description")],
            shading: {
              fill: "D3D3D3",
            },
          }),
        ],
      }),
    ];

    // Add parameter rows
    documentation.parameters.forEach((param) => {
      tableRows.push(
        new docx.TableRow({
          children: [
            new docx.TableCell({
              children: [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: param.name,
                      font: "Consolas",
                    }),
                  ],
                }),
              ],
            }),
            new docx.TableCell({
              children: [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: param.type,
                      font: "Consolas",
                      color: "666666",
                    }),
                  ],
                }),
              ],
            }),
            new docx.TableCell({
              children: [new docx.Paragraph(param.description)],
            }),
          ],
        })
      );
    });

    const parametersTable = new docx.Table({
      rows: tableRows,
      width: {
        size: 100,
        type: docx.WidthType.PERCENTAGE,
      },
    });

    // Create steps section
    const stepsTitle = createHeading("Processing Steps", docx.HeadingLevel.HEADING_2);
    
    const stepsItems = documentation.steps.map(
      (step) =>
        new docx.Paragraph({
          text: step,
          numbering: {
            reference: "steps-numbering",
            level: 0,
          },
          spacing: {
            after: 100,
          },
        })
    );

    // Add code section
    const codeTitle = createHeading("Source Code", docx.HeadingLevel.HEADING_2);
    
    const codePara = new docx.Paragraph({
      children: [
        new docx.TextRun({
          text: pythonFunction.code,
          font: "Consolas",
          size: 20,
        }),
      ],
      spacing: {
        after: 200,
      },
    });

    // Create a new section with all the elements
    doc.addSection({
      properties: {},
      children: [
        title,
        descriptionPara,
        functionalityTitle,
        ...functionalityItems,
        parametersTitle,
        parametersTable,
        stepsTitle,
        ...stepsItems,
        codeTitle,
        codePara,
      ],
      numbering: {
        config: [
          {
            reference: "steps-numbering",
            levels: [
              {
                level: 0,
                format: "decimal",
                text: "%1.",
                alignment: "start",
                style: {
                  run: {
                    bold: true,
                  },
                },
              },
            ],
          },
        ],
      },
    });

    // Generate the document as a blob and save it
    const blob = await docx.Packer.toBlob(doc);
    saveAs(blob, `${pythonFunction.name}_documentation.docx`);
  } catch (error) {
    console.error("Error generating Word document:", error);
    throw error;
  }
};
