const { handleUpload } = require('@vercel/blob');

module.exports = async function (request, response) {
  // 简单的 Token 检查
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return response.status(500).json({ error: "Missing BLOB_READ_WRITE_TOKEN" });
  }

  try {
    const body = request.body;
    
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/avi'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', blob.url);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error(error);
    return response.status(400).json({ error: error.message });
  }
};
