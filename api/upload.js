const { handleUpload } = require('@vercel/blob');

module.exports.config = { runtime: 'nodejs' };

module.exports = async function handler(req, res) {
  // 🔴 诊断点 1：检查 Token 是否在环境中
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ 诊断：后端没读到 BLOB_READ_WRITE_TOKEN。请检查 Storage 是否已 Connect！");
    return res.status(500).json({ error: "服务器未配置存储 Token" });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        console.log("✅ 诊断：正在生成 Token...");
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/avi'],
          tokenPayload: JSON.stringify({}),
        };
      },
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("❌ 诊断：上传逻辑执行失败:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
