import { createMastraCode } from "mastracode";
import { MastraTUI } from "mastracode/tui";

const { harness, hookManager, authStorage } = createMastraCode();

const tui = new MastraTUI({
    harness,
    hookManager,
    authStorage,
    appName: "MastraCode Workshop",
    verbose: true,
});

await tui.run();
