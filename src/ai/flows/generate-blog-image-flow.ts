'use server';
/**
 * @fileOverview A flow for generating blog post images.
 *
 * - generateBlogImage - A function that generates an image based on a prompt.
 * - GenerateBlogImageInput - The input type for the generateBlogImage function.
 * - GenerateBlogImageOutput - The return type for the generateBlogImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateBlogImageInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for the image to be generated.'),
});
export type GenerateBlogImageInput = z.infer<typeof GenerateBlogImageInputSchema>;

const GenerateBlogImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateBlogImageOutput = z.infer<typeof GenerateBlogImageOutputSchema>;

export async function generateBlogImage(input: GenerateBlogImageInput): Promise<GenerateBlogImageOutput> {
  return generateBlogImageFlow(input);
}

const generateBlogImageFlow = ai.defineFlow(
  {
    name: 'generateBlogImageFlow',
    inputSchema: GenerateBlogImageInputSchema,
    outputSchema: GenerateBlogImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a dynamic, 3D-style digital art piece for a blog post. The image should be a high-quality, visually appealing representation of the following theme, suitable for a technology or business blog in a 16:9 aspect ratio: ${input.prompt}.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media || !media.url) {
        throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
