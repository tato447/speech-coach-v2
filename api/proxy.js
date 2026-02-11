import axios from 'axios';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') { res.status(200).end(); return; }

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
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to process workflow' });
    }
}
