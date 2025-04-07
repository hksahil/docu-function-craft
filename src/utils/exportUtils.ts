
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
        children: [
          new docx.Paragraph({
            text: documentation.title,
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          
          new docx.Paragraph({
            children: [new docx.TextRun(documentation.description)],
            spacing: { after: 200 }
          }),

          // Functionality section
          new docx.Paragraph({
            text: "Functionality",
            heading: docx.HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          
          ...documentation.functionality.map(
            (item) =>
              new docx.Paragraph({
                text: item,
                bullet: { level: 0 },
                spacing: { after: 100 }
              })
          ),

          // Parameters section
          new docx.Paragraph({
            text: "Parameters",
            heading: docx.HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          
          new docx.Table({
            rows: [
              new docx.TableRow({
                children: [
                  new docx.TableCell({
                    children: [new docx.Paragraph("Name")],
                    shading: { fill: "D3D3D3" }
                  }),
                  new docx.TableCell({
                    children: [new docx.Paragraph("Type")],
                    shading: { fill: "D3D3D3" }
                  }),
                  new docx.TableCell({
                    children: [new docx.Paragraph("Description")],
                    shading: { fill: "D3D3D3" }
                  })
                ]
              }),
              ...documentation.parameters.map(param => 
                new docx.TableRow({
                  children: [
                    new docx.TableCell({
                      children: [
                        new docx.Paragraph({
                          children: [
                            new docx.TextRun({
                              text: param.name,
                              font: "Consolas"
                            })
                          ]
                        })
                      ]
                    }),
                    new docx.TableCell({
                      children: [
                        new docx.Paragraph({
                          children: [
                            new docx.TextRun({
                              text: param.type || "Any",
                              font: "Consolas",
                              color: "666666"
                            })
                          ]
                        })
                      ]
                    }),
                    new docx.TableCell({
                      children: [new docx.Paragraph(param.description)]
                    })
                  ]
                })
              )
            ],
            width: {
              size: 100,
              type: docx.WidthType.PERCENTAGE
            }
          }),

          // Steps section
          new docx.Paragraph({
            text: "Processing Steps",
            heading: docx.HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          
          ...documentation.steps.map(
            (step, index) =>
              new docx.Paragraph({
                text: step,
                numbering: {
                  reference: "steps-numbering",
                  level: 0
                },
                spacing: { after: 100 }
              })
          ),

          // Code section
          new docx.Paragraph({
            text: "Source Code",
            heading: docx.HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),
          
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: pythonFunction.code,
                font: "Consolas",
                size: 20
              })
            ],
            spacing: { after: 200 }
          })
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
                    run: { bold: true }
                  }
                }
              ]
            }
          ]
        }
      }]
    });

    // Generate the document as a blob and save it
    const blob = await docx.Packer.toBlob(doc);
    saveAs(blob, `${pythonFunction.name}_documentation.docx`);
  } catch (error) {
    console.error("Error generating Word document:", error);
    throw error;
  }
};
