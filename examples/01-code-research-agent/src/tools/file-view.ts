import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { promises as fs } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'
import { truncateStringForTokenEstimate } from '../utils/token-estimator'

const execAsync = promisify(exec)

// Maximum tokens for view tool output
const MAX_VIEW_TOKENS = 1_000

/**
 * Format file content with line numbers (like `cat -n`)
 */
function makeOutput(
  fileContent: string,
  fileDescriptor: string,
  initLine = 1,
  expandTabs = true,
): string {
  if (expandTabs) {
    fileContent = fileContent.replace(/\t/g, '    ')
  }
  const lines = fileContent.split('\n')
  const numberedLines = lines
    .map((line, i) => `${(i + initLine).toString().padStart(6)}\t${line}`)
    .join('\n')
  return `Here's the result of running \`cat -n\` on ${fileDescriptor}:\n${numberedLines}\n`
}

/**
 * Read file content
 */
async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch (e) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    throw new Error(`Failed to read ${filePath}: ${error.message}`)
  }
}

/**
 * Check if path is a directory
 */
async function isDirectory(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

/**
 * Validate path exists and is accessible
 */
async function validatePath(command: string, filePath: string): Promise<void> {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)

  if (!path.isAbsolute(filePath)) {
    filePath = absolutePath
  }

  try {
    const stats = await fs.stat(filePath)
    if (stats.isDirectory() && command !== 'view') {
      throw new Error(
        `The path ${filePath} is a directory and only the \`view\` command can be used on directories`,
      )
    }
  } catch (e) {
    const error = e instanceof Error ? e : new Error('Unknown error')
    if ('code' in error && error.code === 'ENOENT') {
      throw new Error(`The path ${filePath} does not exist. Please provide a valid path.`)
    }
    throw error
  }
}

/**
 * Create the view tool for viewing file contents or directory listings
 */
export function createViewTool(projectRoot?: string) {
  return createTool({
    id: 'view',
    description:
      'View file contents or directory listing. Paths are relative to the project root directory.',
    inputSchema: z.object({
      path: z.string().describe('Path to the file or directory (relative to project root)'),
      view_range: z
        .array(z.number())
        .length(2)
        .optional()
        .describe('Optional range of lines to view [start, end]'),
    }),
    execute: async (context) => {
      try {
        const { path: filePath, view_range } = context

        // Resolve relative to projectRoot if provided, otherwise relative to process.cwd()
        const absolutePath = path.resolve(projectRoot || process.cwd(), filePath)

        await validatePath('view', absolutePath)

        // Handle directory listing
        if (await isDirectory(absolutePath)) {
          // if (view_range) {
          //   throw new Error(
          //     'The `view_range` parameter is not allowed when `path` points to a directory.',
          //   )
          // }

          const { stdout, stderr } = await execAsync(
            `find "${absolutePath}" -maxdepth 2 -not -path '*/\\.*'`,
          )

          if (stderr) {
            throw new Error(stderr)
          }

          const dirOutput = `Here's the files and directories up to 2 levels deep in ${absolutePath}, excluding hidden items:\n${stdout}\n`
          return {
            content: truncateStringForTokenEstimate(dirOutput, MAX_VIEW_TOKENS, false),
            isError: false,
          }
        }

        // Handle file viewing
        const fileContent = await readFile(absolutePath)

        if (view_range) {
          const fileLines = fileContent.split('\n')
          const nLinesFile = fileLines.length
          let [start, end] = view_range

          // Validate start line
          if (start < 1 || start > nLinesFile) {
            throw new Error(
              `Invalid \`view_range\`: ${view_range}. Its first element \`${start}\` should be within the range of lines of the file: [1, ${nLinesFile}]`,
            )
          }

          // Handle end line
          if (end !== -1) {
            if (end > nLinesFile) {
              end = nLinesFile
            }
            if (end < start) {
              throw new Error(
                `Invalid \`view_range\`: ${view_range}. Its second element \`${end}\` should be larger or equal than its first \`${start}\``,
              )
            }
          }

          // Extract selected lines
          const selectedLines =
            end === -1 ? fileLines.slice(start - 1) : fileLines.slice(start - 1, end)

          const output = makeOutput(selectedLines.join('\n'), String(filePath), start)
          return {
            // Truncate from end (keep the start of the range the user requested)
            content: truncateStringForTokenEstimate(output, MAX_VIEW_TOKENS, false),
            isError: false,
          }
        }

        const output = makeOutput(fileContent, String(filePath))
        return {
          // Truncate from end (keep the beginning of the file)
          content: truncateStringForTokenEstimate(output, MAX_VIEW_TOKENS, false),
          isError: false,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        return {
          content: errorMessage,
          isError: true,
        }
      }
    },
  })
}
