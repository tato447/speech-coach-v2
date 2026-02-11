const { handleUpload } = require('@vercel/blob');

// 🔴 强制声明！防止 Vercel 把你当成 Edge 函数
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
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
