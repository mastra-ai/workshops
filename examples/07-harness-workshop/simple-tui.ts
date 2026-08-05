import * as readline from "node:readline";
import type { Harness } from "@mastra/core/harness";
import type { HarnessEvent } from "@mastra/core/harness";

type AnySession = Awaited<ReturnType<Harness["createSession"]>>;

interface SimpleTUIOptions {
    harness: Harness;
    session: AnySession;
    appName?: string;
    /** Tool names to auto-grant on startup (e.g. ["subagent"]). */
    grantTools?: string[];
    /** Start a fresh thread on startup instead of resuming the persisted one. */
    freshThread?: boolean;
}

/**
 * A minimal readline-based terminal UI for driving a Harness session.
 *
 * Unlike the full MastraCode TUI, this does no auth or model-pack selection:
 * the model is whatever the agent/harness was configured with. It just reads a
 * line, sends it to the session, streams the events, and waits for the run to
 * finish before prompting again.
 *
 * Commands:
 *   /mode <id>   switch the session mode
 *   /exit        quit
 */
export class SimpleTUI {
    private readonly harness: Harness;
    private readonly session: AnySession;
    private readonly appName: string;
    private readonly grantTools: string[];
    private readonly freshThread: boolean;
    private rl!: readline.Interface;
    private runDone: (() => void) | null = null;

    // Spinner state.
    private spinnerTimer: NodeJS.Timeout | null = null;
    private spinnerFrame = 0;
    private statusLabel = "thinking";
    private startedAt = 0;
    private static readonly FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

    constructor(options: SimpleTUIOptions) {
        this.harness = options.harness;
        this.session = options.session;
        this.appName = options.appName ?? "Harness TUI";
        this.grantTools = options.grantTools ?? [];
        this.freshThread = options.freshThread ?? false;
    }

    async run(): Promise<void> {
        for (const tool of this.grantTools) {
            this.session.grantTool(tool);
        }

        if (this.freshThread) {
            await this.session.thread.create();
        }

        this.session.subscribe((event) => this.render(event));

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log(`\n${this.appName}`);
        console.log(`mode: ${this.session.mode.get()}  ·  commands: /mode <id>, /exit\n`);

        this.prompt();

        await new Promise<void>((resolve) => {
            this.rl.on("line", (line) => void this.handleLine(line, resolve));
            this.rl.on("close", resolve);
        });
    }

    private prompt(): void {
        this.rl.setPrompt("you > ");
        this.rl.prompt();
    }

    // --- Spinner -----------------------------------------------------------

    private startSpinner(label: string): void {
        this.statusLabel = label;
        if (this.spinnerTimer) return;
        this.startedAt = Date.now();
        this.spinnerTimer = setInterval(() => this.drawSpinner(), 80);
        this.spinnerTimer.unref();
        this.drawSpinner();
    }

    private setStatus(label: string): void {
        this.statusLabel = label;
        if (this.spinnerTimer) this.drawSpinner();
    }

    private drawSpinner(): void {
        const frame = SimpleTUI.FRAMES[this.spinnerFrame % SimpleTUI.FRAMES.length];
        this.spinnerFrame++;
        const secs = ((Date.now() - this.startedAt) / 1000).toFixed(1);
        process.stdout.write(`\r\x1b[2K\x1b[36m${frame}\x1b[0m ${this.statusLabel}… \x1b[90m(${secs}s)\x1b[0m`);
    }

    private stopSpinner(): void {
        if (this.spinnerTimer) {
            clearInterval(this.spinnerTimer);
            this.spinnerTimer = null;
        }
        // Clear the spinner line so the next output starts clean.
        process.stdout.write("\r\x1b[2K");
    }

    /** Render tool args as a short single-line summary. */
    private summarizeArgs(args: unknown): string {
        if (args === null || typeof args !== "object") return "";
        const entries = Object.entries(args as Record<string, unknown>);
        if (entries.length === 0) return "";
        const parts = entries.slice(0, 3).map(([k, v]) => {
            let val: string;
            if (typeof v === "string") val = v;
            else if (v === null || typeof v !== "object") val = String(v);
            else val = Array.isArray(v) ? `[${v.length}]` : "{…}";
            if (val.length > 40) val = `${val.slice(0, 39)}…`;
            return `${k}: ${val}`;
        });
        if (entries.length > 3) parts.push("…");
        return `{ ${parts.join(", ")} }`;
    }

    /** Print a line without leaving the spinner artifact behind. */
    private println(line: string): void {
        const active = this.spinnerTimer !== null;
        if (active) process.stdout.write("\r\x1b[2K");
        console.log(line);
        if (active) this.drawSpinner();
    }

    private async handleLine(line: string, done: () => void): Promise<void> {
        const input = line.trim();

        if (!input) {
            this.prompt();
            return;
        }

        if (input === "/exit" || input === "/quit") {
            this.rl.close();
            await this.harness.destroy();
            done();
            return;
        }

        if (input.startsWith("/mode")) {
            const modeId = input.slice("/mode".length).trim();
            if (!modeId) {
                console.log(`current mode: ${this.session.mode.get()}`);
            } else {
                try {
                    await this.session.mode.switch({ modeId });
                    console.log(`switched to mode: ${modeId}`);
                } catch (error) {
                    console.log(`could not switch mode: ${(error as Error).message}`);
                }
            }
            this.prompt();
            return;
        }

        // Pause input until the run finishes, then re-prompt.
        this.rl.pause();
        await new Promise<void>((resolve) => {
            this.runDone = resolve;
            void this.session.sendMessage({ content: input });
        });
        this.runDone = null;
        this.rl.resume();
        this.prompt();
    }

    private render(event: HarnessEvent): void {
        switch (event.type) {
            case "agent_start":
                this.startSpinner("thinking");
                break;
            case "tool_start": {
                const summary = this.summarizeArgs(event.args);
                this.println(`  \x1b[33m⚙\x1b[0m ${event.toolName}${summary ? ` \x1b[90m${summary}\x1b[0m` : ""}`);
                this.setStatus(`running ${event.toolName}`);
                break;
            }
            case "tool_end":
                this.setStatus("thinking");
                break;
            case "subagent_start":
                this.println(`  \x1b[35m▸\x1b[0m subagent [${event.agentType}]: ${event.task}`);
                this.setStatus(`subagent ${event.agentType} working`);
                break;
            case "subagent_end":
                this.println(`  \x1b[35m◂\x1b[0m subagent [${event.agentType}] done \x1b[90m(${event.durationMs}ms)\x1b[0m`);
                this.setStatus("thinking");
                break;
            case "message_end": {
                if (event.message.role !== "assistant") break;
                const text = event.message.content
                    .filter((c): c is Extract<typeof c, { type: "text" }> => c.type === "text")
                    .map((c) => c.text)
                    .join("");
                if (text) {
                    this.stopSpinner();
                    console.log(`\nassistant > ${text}\n`);
                }
                break;
            }
            case "usage_update":
                if (event.usage.totalTokens > 0) {
                    this.println(
                        `  \x1b[90m${event.usage.promptTokens} in + ${event.usage.completionTokens} out = ${event.usage.totalTokens} tokens\x1b[0m`,
                    );
                }
                break;
            case "error":
                this.stopSpinner();
                console.error(`\n\x1b[31m[error]\x1b[0m ${event.error.message}\n`);
                break;
            case "agent_end":
                this.stopSpinner();
                this.runDone?.();
                break;
        }
    }
}
