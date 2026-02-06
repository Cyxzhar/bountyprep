import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import chatHandler from './api/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/chat', chatHandler);

// Serve Static Files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
