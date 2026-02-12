const axios = require('axios');

// 🔴 强制指定 Node.js 环境
module.exports.config = {
  runtime: 'nodejs',
};

module.exports = async function handler(req, res) {
    // 设置跨域允许
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { videoUrl } = req.body;
        
        console.log('正在请求 Coze, 视频地址:', videoUrl);

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
                }
            }
        );

        res.status(200).json(response.data);

    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to process workflow' });
    }
};
