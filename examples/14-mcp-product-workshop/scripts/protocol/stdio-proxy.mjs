import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const child = spawn('pnpm', ['exec', 'tsx', 'scripts/protocol/stdio-server.ts'], { stdio: ['pipe', 'pipe', 'inherit'] });
function forward(source, target, direction) {
  let pending = '';
  source.on('data', chunk => {
    pending += chunk.toString();
    const lines = pending.split('\n'); pending = lines.pop() ?? '';
    for (const line of lines) if (line.trim()) {
      const body = JSON.parse(line);
      appendFileSync(process.env.STDIO_WIRE_PATH, JSON.stringify({ direction, method: body.method, body }) + '\n');
    }
    target.write(chunk);
  });
}
forward(process.stdin, child.stdin, 'request');
forward(child.stdout, process.stdout, 'body');
process.stdin.on('end', () => child.stdin.end());
process.once('SIGTERM', () => child.kill('SIGTERM'));
child.on('exit', code => process.exit(code ?? 0));
