const { handleUpload } = require('@vercel/blob');

// 🔴 关键修复：强制告诉 Vercel 使用标准 Node.js，不再报 Edge 错误
module.exports.config = {
  runtime: 'nodejs'
};

module.exports = async function handler(req, res) {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/avi'],
        tokenPayload: JSON.stringify({}),
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('文件已存入存储空间:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
