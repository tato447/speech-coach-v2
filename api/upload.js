import { handleUpload } from '@vercel/blob';

// 👇 关键：这行代码会强制 Vercel 用 Node.js 运行，彻底解决 "Edge" 报错
export const config = {
  runtime: 'nodejs',
};

export default async function handler(request, response) {
  const body = request.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/avi'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed:', blob.url);
      },
    });

    response.status(200).json(jsonResponse);
  } catch (error) {
    // 打印错误日志，方便在 Vercel 后台查看
    console.error("Upload Token Error:", error);
    response.status(400).json({ error: error.message });
  }
}
