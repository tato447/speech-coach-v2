const { handleUpload } = require('@vercel/blob');

// ⬇️ 告诉 Vercel 必须用 Node.js 跑，否则会报错
module.exports.config = {
  runtime: 'nodejs',
};

// ⬇️ 修复点：直接导出函数，不要加 .default
module.exports = async function (request, response) {
  // 1. 检查环境变量是否存在（帮你诊断是不是配置问题）
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ 严重错误: 环境变量 BLOB_READ_WRITE_TOKEN 未找到！");
    return response.status(500).json({ error: "服务器配置缺失: BLOB_READ_WRITE_TOKEN" });
  }

  try {
    const body = request.body;
    
    // 2. 处理上传请求
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

    // 3. 成功返回
    return response.status(200).json(jsonResponse);

  } catch (error) {
    console.error("❌ HandleUpload Error:", error);
    return response.status(400).json({ error: error.message });
  }
};
