
import { PythonFunction } from "@/types/pythonTypes";
import { Documentation } from "@/utils/documentation/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function generateDocumentationWithGpt(
  pythonFunction: PythonFunction,
  apiKey: string
): Promise<Documentation | null> {
  if (!apiKey) {
    console.error("OpenAI API key is required");
    return null;
  }

  const prompt = `
Please analyze this Python function and provide comprehensive documentation for it:

\`\`\`python
${pythonFunction.code}
\`\`\`

Generate a JSON output with the following structure:
{
  "title": "Human-readable title for the function",
  "description": "Brief description of what the function does",
  "functionality": ["List", "of", "key", "functionalities"],
  "parameters": [
    {
      "name": "parameter_name",
      "type": "parameter_type",
      "description": "parameter description"
    }
  ],
  "steps": ["Step 1 of the process", "Step 2 of the process"],
  "returns": "Description of what the function returns"
}
`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a technical documentation assistant that specializes in Python code analysis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const gptResponse = data.choices[0]?.message?.content || "";

    // Extract JSON from the response (it might be wrapped in markdown code blocks)
    const jsonMatch = gptResponse.match(/```json\n([\s\S]*?)\n```/) || 
                      gptResponse.match(/```\n([\s\S]*?)\n```/) || 
                      gptResponse.match(/{[\s\S]*?}/);
                      
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : gptResponse;
    
    try {
      const parsedDoc = JSON.parse(jsonString);
      return parsedDoc as Documentation;
    } catch (parseError) {
      console.error("Failed to parse GPT response as JSON:", parseError);
      console.log("Raw response:", gptResponse);
      return null;
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return null;
  }
}
