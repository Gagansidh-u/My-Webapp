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
      prompt: `Generate a high-quality, visually appealing image for a blog post with the following theme: ${input.prompt}. The image should be in a 16:9 aspect ratio and suitable for a technology or business blog.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        aspectRatio: '16:9',
      },
    });
    
    if (!media || !media.url) {
        throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
