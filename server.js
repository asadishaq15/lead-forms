// server.js
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  // API routes
  app.get('/api/ping', async (req, res) => {
    const { trackdrive_number, traffic_source_id, caller_id } = req.query;
  
    if (!trackdrive_number || !traffic_source_id || !caller_id) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }
  
    const url = `https://kbb-sales-group-llc.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_aca_buyers?trackdrive_number=${encodeURIComponent(trackdrive_number)}&traffic_source_id=${encodeURIComponent(traffic_source_id)}&caller_id=${encodeURIComponent(caller_id)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post('/api/post', async (req, res) => {
    // Get the body from the request
    let body = req.body;
  
    try {
      const response = await fetch(
        "https://kbb-sales-group-llc.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_aca_buyers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    // Serve index.html for all other routes to support SPA routing
    const template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8'
    );
    
    const html = await vite.transformIndexHtml(req.originalUrl, template);
    res.status(200).html(html);
  });

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

createServer();