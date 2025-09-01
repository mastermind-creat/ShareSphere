'use server';
/**
 * @fileOverview An AI flow for searching user files based on natural language queries.
 *
 * - searchFiles - A function that handles the file search process.
 * - FileSearchResult - The return type for the searchFiles function.
 */
import { ai } from '@/ai/genkit';
import { getUserFiles, type FileDocument } from '@/services/files';
import { z } from 'zod';

const SearchFilesInputSchema = z.string();

const FileSearchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.string(),
  reasoning: z.string().describe("A brief explanation of why this file matches the user's query."),
});
export type FileSearchResult = z.infer<typeof FileSearchResultSchema>;

const SearchFilesOutputSchema = z.array(FileSearchResultSchema);

export async function searchFiles(query: string): Promise<FileSearchResult[]> {
  return searchFilesFlow(query);
}

const filesTool = ai.defineTool(
  {
    name: 'retrieveUserFiles',
    description: 'Retrieves a list of all files uploaded by the current user.',
    inputSchema: z.void(),
    outputSchema: z.array(z.object({
      id: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string(),
    })),
  },
  async () => {
    const files = await getUserFiles();
    // We only pass essential information to the model
    return files.map(({ id, name, size, type, url }) => ({ id, name, size, type, url }));
  }
);

const searchFilesFlow = ai.defineFlow(
  {
    name: 'searchFilesFlow',
    inputSchema: SearchFilesInputSchema,
    outputSchema: SearchFilesOutputSchema,
  },
  async (query) => {
    const llmResponse = await ai.generate({
      prompt: `You are an intelligent file search assistant. Your task is to analyze the user's query and the provided list of files to find the most relevant matches.

User Query: "${query}"

Based on the query, identify the files from the list that best match the user's request. Consider file names, types, and potential content implied by these properties. For each match, provide a brief reasoning for your choice. Return an array of matching files. If no files match, return an empty array.`,
      tools: [filesTool],
      output: {
        schema: SearchFilesOutputSchema,
      },
    });

    return llmResponse.output() || [];
  }
);
