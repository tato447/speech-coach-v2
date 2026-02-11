import { handleUpload } from '@vercel/blob';

// 👇 核心修复：显式告诉 Vercel 这不是 Edge 模式，是 Node.js 模式
export const config = {
  runtime: 'nodejs',
};

export default async function handler(request, response) {
  try {
    const jsonResponse = await handleUpload({
      body: request.body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/avi'],
        tokenPayload: JSON.stringify({}),
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', blob.url);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Upload Error:", error);
    return response.status(400).json({ error: error.message });
  }
}
