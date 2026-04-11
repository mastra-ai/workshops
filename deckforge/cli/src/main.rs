use anyhow::{Context, Result};
use clap::Parser;
use std::path::PathBuf;

mod config;
mod llm;
mod slide;

#[derive(Parser)]
#[command(name = "deckforge-enhance")]
#[command(about = "Model-agnostic LLM enhancement advisor for DeckForge presentations")]
struct Cli {
    /// Path to the deck output directory (containing deck.json)
    #[arg(short, long)]
    deck: PathBuf,

    /// Path to config file (default: ~/.config/deckforge/config.toml)
    #[arg(short, long)]
    config: Option<PathBuf>,

    /// LLM provider to use (anthropic, openai)
    #[arg(short, long)]
    provider: Option<String>,

    /// Model name override
    #[arg(short, long)]
    model: Option<String>,

    /// Review a specific slide by filename (default: review all)
    #[arg(short, long)]
    slide: Option<String>,

    /// Output suggestions to JSON file instead of stdout
    #[arg(short, long)]
    output: Option<PathBuf>,

    /// Apply suggestions interactively (prompt for each)
    #[arg(long)]
    interactive: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    // Load config
    let cfg = config::load_config(cli.config.as_deref())
        .context("Failed to load configuration")?;

    // Resolve provider
    let provider_name = cli.provider
        .as_deref()
        .unwrap_or(&cfg.default_provider);

    let provider_cfg = cfg.providers.get(provider_name)
        .context(format!("Provider '{}' not found in config", provider_name))?;

    let model = cli.model
        .as_deref()
        .unwrap_or(&provider_cfg.model);

    // Load deck manifest
    let manifest = slide::load_manifest(&cli.deck)
        .context("Failed to load deck.json")?;

    println!("\n  DeckForge Enhancement Advisor");
    println!("  ─────────────────────────────");
    println!("  Deck:     {}", manifest.title);
    println!("  Slides:   {}", manifest.slides.len());
    println!("  Provider: {} ({})", provider_name, model);
    println!();

    // Build the LLM client
    let client = llm::create_client(provider_name, provider_cfg, model)?;

    // Read the component reference for the system prompt
    let component_ref = slide::COMPONENT_REFERENCE;

    // Process slides
    let slides_to_review: Vec<_> = if let Some(ref name) = cli.slide {
        manifest.slides.iter()
            .filter(|s| s.file == *name)
            .collect()
    } else {
        manifest.slides.iter().collect()
    };

    let mut all_suggestions = Vec::new();

    for slide_meta in &slides_to_review {
        let slide_path = cli.deck.join(&slide_meta.file);
        let html = std::fs::read_to_string(&slide_path)
            .context(format!("Failed to read {}", slide_meta.file))?;

        println!("  Reviewing: {} ...", slide_meta.file);

        let suggestions = client.get_suggestions(
            &slide_meta.file,
            &slide_meta.title,
            &html,
            component_ref,
        ).await?;

        println!("    → {} suggestions\n", suggestions.len());

        all_suggestions.push(slide::SlideSuggestions {
            file: slide_meta.file.clone(),
            title: slide_meta.title.clone(),
            suggestions,
        });
    }

    // Output
    if let Some(ref output_path) = cli.output {
        let json = serde_json::to_string_pretty(&all_suggestions)?;
        std::fs::write(output_path, &json)?;
        println!("  ✓ Suggestions written to {}\n", output_path.display());
    } else {
        // Print to stdout
        for slide_sugs in &all_suggestions {
            println!("  ### {}\n", slide_sugs.title);
            for (i, sug) in slide_sugs.suggestions.iter().enumerate() {
                println!("  {}. **{}**", i + 1, sug.name);
                println!("     {}", sug.description);
                println!("     Impact: {}\n", sug.visual_impact);
            }
        }
    }

    // Interactive mode
    if cli.interactive {
        interactive_apply(&cli.deck, &all_suggestions)?;
    }

    Ok(())
}

fn interactive_apply(
    deck_dir: &PathBuf,
    all_suggestions: &[slide::SlideSuggestions],
) -> Result<()> {
    use std::io::{self, Write};

    for slide_sugs in all_suggestions {
        println!("\n  === {} ===\n", slide_sugs.title);
        for (i, sug) in slide_sugs.suggestions.iter().enumerate() {
            print!("  [{}] {} — Apply? (y/n): ", i + 1, sug.name);
            io::stdout().flush()?;

            let mut input = String::new();
            io::stdin().read_line(&mut input)?;

            if input.trim().to_lowercase() == "y" {
                let slide_path = deck_dir.join(&slide_sugs.file);
                let html = std::fs::read_to_string(&slide_path)?;
                let enhanced = sug.apply(&html);
                std::fs::write(&slide_path, &enhanced)?;
                println!("    ✓ Applied\n");
            } else {
                println!("    ✗ Skipped\n");
            }
        }
    }
    Ok(())
}
