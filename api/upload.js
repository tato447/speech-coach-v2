const { handleUpload } = require('@vercel/blob');

// ⬇️ 强制指定 Node.js 环境（这是防止报错的关键！）
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
    console.error("Upload Error:", error);
    response.status(400).json({ error: error.message });
  }
};
