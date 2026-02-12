const OSS = require('ali-oss');

// 强制 Node 环境
module.exports.config = { runtime: 'nodejs' };

module.exports = async function handler(req, res) {
  // 1. 初始化 OSS 客户端 (只在服务器端运行，Key 不会泄露)
  const client = new OSS({
    region: process.env.ALI_REGION,
    accessKeyId: process.env.ALI_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET,
    bucket: process.env.ALI_BUCKET,
    secure: true, // 使用 HTTPS
  });

  try {
    // 2. 生成一个唯一文件名
    const filename = `videos/${Date.now()}.mp4`;

    // 3. 生成带签名的上传链接 (PUT 方法)
    // 前端拿着这个链接，可以直接把文件“塞”进阿里云
    const uploadUrl = client.signatureUrl(filename, {
      method: 'PUT',
      'Content-Type': 'video/mp4', 
      expires: 600 // 10分钟有效
    });

    // 4. 生成公开访问链接 (给 Coze 用)
    // 只要 Bucket 是“公共读”，这个链接就是永久有效的
    // 格式通常是: https://bucket-name.oss-region.aliyuncs.com/filename
    const publicUrl = `https://${process.env.ALI_BUCKET}.${process.env.ALI_REGION}.aliyuncs.com/${filename}`;

    res.status(200).json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("OSS Config Error:", error);
    res.status(500).json({ error: error.message });
  }
};
