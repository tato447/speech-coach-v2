const axios = require('axios');

module.exports.config = {
  runtime: 'nodejs'
};

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { videoUrl } = req.body;
        const response = await axios.post(
            'https://api.coze.cn/v1/workflow/run',
            {
                workflow_id: process.env.WORKFLOW_ID,
                parameters: { input: videoUrl }
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
        console.error("代理转发报错:", error.message);
        res.status(500).json({ error: error.message });
    }
};
