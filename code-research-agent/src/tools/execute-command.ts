import { z } from 'zod'
import { execa, ExecaError } from 'execa'
import stripAnsi from 'strip-ansi'
import { truncateStringForTokenEstimate } from '../utils/token-estimator'
import treeKill from 'tree-kill'
import { createTool } from '@mastra/core/tools'

// Track active subprocesses to clean up on exit
const activeSubprocesses = new Set<number>()
let cleanupHandlersRegistered = false

// Register global cleanup handlers to kill all active subprocesses on exit
function registerCleanupHandlers() {
  if (cleanupHandlersRegistered) return
  cleanupHandlersRegistered = true

  const killAllSubprocesses = () => {
    for (const pid of activeSubprocesses) {
      try {
        process.kill(-pid, 'SIGKILL')
      } catch {
        // Process may already be dead
      }

      treeKill(pid, 'SIGKILL', () => {})
    }
    activeSubprocesses.clear()
  }

  process.on('exit', () => {
    killAllSubprocesses()
  })

  process.on('SIGINT', () => {
    killAllSubprocesses()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    killAllSubprocesses()
    process.exit(0)
  })
}

const ExecuteCommandSchema = z.object({
  command: z.string().describe('Full shell command to execute'),
  cwd: z.string().optional().describe('Working directory for command execution'),
  timeout: z
    .number()
    .optional()
    .describe(
      "The number of seconds until the shell command should be killed if it hasn't exited yet. Defaults to 30 seconds",
    ),
})

export function createExecuteCommandTool(projectRoot?: string) {
  return createTool({
    id: 'execute_command',
    description: 'Execute a command in the local system',
    inputSchema: ExecuteCommandSchema,
    execute: async (context) => {
      const { command } = context
      const cwd = context.cwd || projectRoot || process.cwd()

      if (context.timeout && context.timeout >= 1000) context.timeout = context.timeout / 1000
      const timeoutMS = context.timeout ? context.timeout * 1000 : 30_000

      let timeoutHandle: NodeJS.Timeout | undefined
      let manuallyKilled = false
      let subprocess: ReturnType<typeof execa> | undefined

      try {
        subprocess = execa(command, {
          cwd,
          shell: true,
          stdio: ['inherit', 'pipe', 'pipe'],
          buffer: true,
          all: true,
          env: {
            ...process.env,
            FORCE_COLOR: '1',
            CLICOLOR_FORCE: '1',
            TERM: process.env.TERM || 'xterm-256color',
            CI: 'true',
            NONINTERACTIVE: '1',
            DEBIAN_FRONTEND: 'noninteractive',
          },
          stripFinalNewline: false,
          timeout: timeoutMS,
          forceKillAfterDelay: 100,
          killSignal: 'SIGKILL',
          cleanup: true,
          detached: true,
        })

        registerCleanupHandlers()
        if (subprocess.pid) {
          activeSubprocesses.add(subprocess.pid)
        }

        if (timeoutMS && subprocess.pid) {
          timeoutHandle = setTimeout(() => {
            if (subprocess?.pid) {
              manuallyKilled = true
              try {
                process.kill(-subprocess.pid, 'SIGKILL')
              } catch (err) {
                treeKill(subprocess.pid, 'SIGKILL')
              }
            }
          }, timeoutMS - 100)
        }

        const result = await subprocess

        if (timeoutHandle) {
          clearTimeout(timeoutHandle)
        }

        const rawOutput =
          result.all ||
          result.stdout ||
          result.stderr ||
          'Command executed successfully with no output'
        const cleanOutput = stripAnsi(
          typeof rawOutput === 'string' ? rawOutput : rawOutput.toString(),
        )

        return {
          content: [
            {
              type: 'text',
              text: truncateStringForTokenEstimate(cleanOutput, 2_000),
            },
          ],
          isError: false,
        }
      } catch (error: any) {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle)
        }

        let cleanError = ''

        if (error instanceof ExecaError) {
          const causeMessage = (error.cause as Error)?.message || ''
          const stderr = error.stderr ? stripAnsi(error.stderr) : ''
          const stdout = error.stdout ? stripAnsi(error.stdout) : ''
          const all = error.all ? stripAnsi(error.all) : ''
          const isTimeout = error.timedOut || error.isCanceled || manuallyKilled

          const parts = []
          if (isTimeout) {
            parts.push(`Error: command timed out after ${timeoutMS}ms`)
          } else if (causeMessage) {
            parts.push(`Error: ${stripAnsi(causeMessage)}`)
          }

          if (all) {
            parts.push(`Output: ${all}`)
          } else {
            if (stderr) parts.push(`STDERR: ${stderr}`)
            if (stdout) parts.push(`STDOUT: ${stdout}`)
          }

          cleanError = parts.join('\n\n')
        } else {
          try {
            if (
              error &&
              typeof error === 'object' &&
              'message' in error &&
              typeof error.message === 'string'
            ) {
              cleanError = error.message
            } else {
              cleanError = String(error)
            }
          } catch {
            cleanError = String(error)
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: truncateStringForTokenEstimate(cleanError, 2_000),
            },
          ],
          isError: true,
        }
      } finally {
        if (subprocess && subprocess.pid) {
          activeSubprocesses.delete(subprocess.pid)
        }

        if (subprocess && subprocess.pid) {
          try {
            process.kill(-subprocess.pid, 'SIGKILL')
          } catch {
            // Process group may already be dead
          }

          const pid = subprocess?.pid
          if (pid) {
            try {
              await new Promise<void>((resolve) => {
                treeKill(pid, 'SIGKILL', (err) => {
                  resolve()
                })
              })
            } catch {
              // Ignore errors from tree-kill
            }
          }
        }
      }
    },
  })
}
