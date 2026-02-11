import { handleUpload } from '@vercel/blob';

// 强制指定 Node.js 环境
export const config = {
  runtime: 'nodejs',
};

export default async function handler(request, response) {
  // 1. 安全检查：确认 token 存在
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ 环境变量缺失: BLOB_READ_WRITE_TOKEN");
    return response.status(500).json({ error: "Server Configuration Error: Missing Token" });
  }

  try {
    const body = await request.body;
    
    // 2. 处理握手请求
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
        console.log('✅ Upload completed:', blob.url);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error("❌ API Error:", error);
    return response.status(400).json({ error: error.message });
  }
}
