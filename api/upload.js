const { handleUpload } = require('@vercel/blob');

// 👇 核心修复：这行代码强制 Vercel 使用 Node.js 运行，彻底解决 "Edge" 报错
module.exports.config = {
  runtime: 'nodejs',
};

module.exports.default = async function handler(request, response) {
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
    console.error("Token Error:", error);
    response.status(400).json({ error: error.message });
  }
};
