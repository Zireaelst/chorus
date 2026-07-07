const http = require('http');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const redisClient = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null
});

const proofsQueue = new Queue('proof-verification', {
  connection: redisClient
});

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/v1/proofs') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      console.log('[Mock API] Received POST /v1/proofs', data.cohortId);
      const crypto = require('crypto');
      const contributionId = crypto.randomUUID();
      
      await proofsQueue.add('verify-proof', {
        contributionId,
        cohortId: data.cohortId,
        orgId: data.orgId,
        roundNumber: data.roundNumber,
        proof: data.proof
      });
      console.log('[Mock API] Queued proof-verification job');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Proof queued' }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001, () => {
  console.log('[Mock API] Listening on port 3001');
});
