import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
    res.json({
        url: req.url,
        method: req.method,
        headers: req.headers,
        query: req.query,
        env: {
            node_env: process.env.NODE_ENV
        }
    });
}
