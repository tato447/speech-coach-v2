const { handleUpload } = require('@vercel/blob');

// 强制锁定 Node 环境，防止 Vercel 误切到 Edge 模式
module.exports.config = {
  runtime: 'nodejs'
};

module.exports = async function handler(req, res) {
  // 增加后端自检日志，你可以在 Vercel Logs 里看到
  console.log("收到上传请求，Token 状态:", !!process.env.BLOB_READ_WRITE_TOKEN);

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/avi'],
        tokenPayload: JSON.stringify({}),
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('文件已存入存储:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("上传接口报错:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
