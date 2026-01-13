import express from 'express';
// @ts-ignore
import mainApp from '../backend/src/index.js';

const app = express();
// Mount the main backend app as a sub-app
// It already contains all /api and root routes
app.use(mainApp);

export default app;
