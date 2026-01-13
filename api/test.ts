import express from 'express';
export default (req, res) => {
    res.status(200).json({ express: !!express, version: express.version || 'unknown' });
};
