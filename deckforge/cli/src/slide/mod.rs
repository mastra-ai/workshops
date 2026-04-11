use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::path::Path;

/// Deck manifest (deck.json).
#[derive(Debug, Deserialize)]
pub struct Manifest {
    pub title: String,
    pub slides: Vec<SlideEntry>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SlideEntry {
    pub file: String,
    pub title: String,
    pub nav: String,
    pub level: u32,
    pub group: Option<String>,
    pub group_index: u32,
    pub is_group_header: bool,
}

/// A single enhancement suggestion from the LLM.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Suggestion {
    pub name: String,
    pub description: String,
    pub visual_impact: String,
    #[serde(default)]
    pub css_additions: String,
    #[serde(default)]
    pub js_additions: String,
    #[serde(default)]
    pub html_diff: String,
}

impl Suggestion {
    /// Apply this suggestion to an HTML slide.
    /// Injects CSS into <head> and JS before </body>.
    pub fn apply(&self, html: &str) -> String {
        let mut result = html.to_string();

        // Inject CSS before </head>
        if !self.css_additions.is_empty() {
            let css_block = format!(
                "\n  <style>\n    /* Enhancement: {} */\n{}\n  </style>",
                self.name,
                self.css_additions,
            );
            result = result.replace("</head>", &format!("{}\n</head>", css_block));
        }

        // Inject JS before </body>
        if !self.js_additions.is_empty() {
            let js_block = format!(
                "\n  <script>\n    // Enhancement: {}\n{}\n  </script>",
                self.name,
                self.js_additions,
            );
            result = result.replace("</body>", &format!("{}\n</body>", js_block));
        }

        result
    }
}

/// Collection of suggestions for a single slide.
#[derive(Debug, Serialize, Deserialize)]
pub struct SlideSuggestions {
    pub file: String,
    pub title: String,
    pub suggestions: Vec<Suggestion>,
}

/// Load the deck manifest from a directory.
pub fn load_manifest(deck_dir: &Path) -> Result<Manifest> {
    let manifest_path = deck_dir.join("deck.json");
    let content = std::fs::read_to_string(&manifest_path)
        .context(format!("Failed to read {}", manifest_path.display()))?;
    let manifest: Manifest = serde_json::from_str(&content)
        .context("Failed to parse deck.json")?;
    Ok(manifest)
}

/// Condensed component reference for the LLM system prompt.
/// This is a trimmed version of the full SKILL.md — just the class names and what they do.
pub const COMPONENT_REFERENCE: &str = r#"
## Available CSS Classes

Layout: .section, .section.centered, .section.wide, .grid-2 to .grid-5, .card-grid, .demo-layout
Cards: .card (standard), .stat-card + .stat-grid (big numbers), .demo-card + .demo-grid (accent numbers), .phase-card (.input/.input-step/.output-step/.output-result)
Code: .code-block > .code-header + .code-body, .code-highlight-block > .code-line (.dim/.highlight), syntax: .kw .fn .str .num .cm .type .prop
Flow: .flow > .flow-node (.accent/.green/.purple/.orange) + .flow-arrow, .pipeline > .pipeline-node + .pipeline-arrow
Typography: .section-label, .subtitle, .highlight, .color-{green,red,yellow,orange,purple,cyan}, .text-dim, .text-sm, .text-xs, .mono
Callouts: .callout + .callout-label, .inline-note (.accent/.green/.yellow/.orange) > .note-icon
Interactive: .mode-toggle > button.active
Lists: .roadmap-list > .roadmap-item > .roadmap-marker + .roadmap-content
TUI: .tui-window > .tui-titlebar (.tui-dots > span×3 + .tui-title) + .tui-body
Animation: .fade-on-scroll (auto via IntersectionObserver), .stagger-in (children auto-stagger nth-child 1-6)
Utility: .mt-1 to .mt-6, .mb-1/.mb-2/.mb-4, .gap-3

## Available JS Functions
typewriter(el, text, speed=30) — character-by-character reveal
staggerAppear(container, selector, delay=100) — staggered fade-in
wait(ms) — promise delay

## CSS Variables
Backgrounds: --bg-primary (#0b1220), --bg-secondary (#101d2e), --bg-card (#142236)
Text: --text-primary (#e2e8f0), --text-secondary (#8b9cb8), --text-dim (#4a5e78)
Accent: --accent (#f5a623), --accent-hover (#f7b84e), --accent-dim (rgba)
Colors: --green, --red, --yellow, --orange, --purple, --cyan (each with -dim variant)
Borders: --border (6% white), --border-light (10% white)
Fonts: --font-sans (Barlow), --font-mono (Fira Code)
"#;
