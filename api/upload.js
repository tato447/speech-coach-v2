import { handleUpload } from '@vercel/blob';

// 强制指定 Node.js 环境
export const config = {
  runtime: 'nodejs',
};

export default async function handler(request, response) {
  console.log("👉 [诊断日志] 收到请求: /api/upload");
  
  // 1. 检查环境变量
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  console.log(`🔑 [诊断日志] Token 状态: ${hasToken ? "✅ 存在" : "❌ 丢失"}`);

  if (!hasToken) {
    return response.status(500).json({ 
      error: "服务器配置错误: BLOB_READ_WRITE_TOKEN 环境变量未找到。请检查 Vercel Storage 设置。" 
    });
  }

  try {
    const body = await request.body; // 注意：在某些 Node 环境下 body 可能是 stream
    
    // 2. 尝试处理上传握手
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        console.log("📝 [诊断日志] 正在生成 Token...");
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/avi'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('✅ [诊断日志] 上传完成:', blob.url);
      },
    });

    console.log("📤 [诊断日志] 握手成功，返回 Token");
    return response.status(200).json(jsonResponse);

  } catch (error) {
    console.error("❌ [诊断日志] 发生异常:", error);
    // 返回详细错误给前端，方便弹窗显示
    return response.status(400).json({ 
      error: error.message,
      detail: "后端 handleUpload 执行失败" 
    });
  }
}
