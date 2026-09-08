import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

export async function startServer() {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const address = reservation.address();
  if (!address || typeof address === 'string') throw new Error('No allocated port');
  const port = address.port;
  await new Promise<void>((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
  const child = spawn('pnpm', ['exec', 'mastra', 'dev'], { env: { ...process.env, PORT: String(port) }, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', data => { output += data; });
  child.stderr.on('data', data => { output += data; });
  const baseUrl = `http://localhost:${port}`;
  async function close() {
    if (child.exitCode !== null) return;
    if (child.pid) process.kill(-child.pid, 'SIGTERM');
    await Promise.race([once(child, 'exit'), new Promise(resolve => setTimeout(resolve, 3000))]);
    if (child.exitCode === null && child.pid) process.kill(-child.pid, 'SIGKILL');
  }
  try {
    for (let attempt = 0; attempt < 120; attempt++) {
      if (child.exitCode !== null) throw new Error(output);
      const response = await fetch(`${baseUrl}/returns/orders/ORD-001`, { headers: { authorization: 'Bearer workshop-north' }, signal: AbortSignal.timeout(1000) }).catch(() => undefined);
      if (response?.ok) return { baseUrl, close };
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    throw new Error(`Server readiness timeout: ${output}`);
  } catch (error) { await close(); throw error; }
}
