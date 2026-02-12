const axios = require('axios');

// 🔴 核心修复：申请最高 60秒 的运行时间 (原默认 10秒)
// 这能让 AI 有足够的时间看完视频并写出报告
module.exports.config = {
  runtime: 'nodejs',
  maxDuration: 60, 
};

module.exports = async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { videoUrl } = req.body;
        console.log("正在请求 Coze 分析，视频地址:", videoUrl);

        // 调用 Coze 工作流
        const response = await axios.post(
            'https://api.coze.cn/v1/workflow/run',
            {
                workflow_id: process.env.WORKFLOW_ID,
                parameters: {
                    input: videoUrl 
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.COZE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                // 🔴 防止 axios 自己先超时，设置无限等待
                timeout: 60000 
            }
        );

        res.status(200).json(response.data);

    } catch (error) {
        console.error('Coze API Error:', error.message);
        // 如果是超时，给前端一个明确的提示
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            res.status(504).json({ error: 'AI 思考时间过长，Vercel 强制断开了连接。建议上传更短的视频测试。' });
        } else {
            res.status(500).json({ error: 'Failed to process workflow: ' + error.message });
        }
    }
};
