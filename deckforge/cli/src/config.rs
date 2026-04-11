use anyhow::{Context, Result};
use serde::Deserialize;
use std::collections::HashMap;
use std::path::Path;

#[derive(Debug, Deserialize)]
pub struct Config {
    #[serde(default = "default_provider")]
    pub default_provider: String,
    #[serde(default)]
    pub providers: HashMap<String, ProviderConfig>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct ProviderConfig {
    pub api_key: String,
    #[serde(default)]
    pub model: String,
    #[serde(default)]
    pub base_url: Option<String>,
}

fn default_provider() -> String {
    "anthropic".to_string()
}

/// Load config from a specified path or the default location.
///
/// Config file format (TOML):
/// ```toml
/// default_provider = "anthropic"
///
/// [providers.anthropic]
/// api_key = "sk-ant-..."
/// model = "claude-sonnet-4-20250514"
///
/// [providers.openai]
/// api_key = "sk-..."
/// model = "gpt-4o"
///
/// [providers.custom]
/// api_key = "..."
/// model = "my-model"
/// base_url = "https://my-llm-api.example.com/v1"
/// ```
pub fn load_config(path: Option<&Path>) -> Result<Config> {
    let config_path = if let Some(p) = path {
        p.to_path_buf()
    } else {
        let config_dir = dirs::config_dir()
            .context("Could not determine config directory")?;
        config_dir.join("deckforge").join("config.toml")
    };

    // Check environment variables as fallback
    if !config_path.exists() {
        return config_from_env();
    }

    let content = std::fs::read_to_string(&config_path)
        .context(format!("Failed to read config from {}", config_path.display()))?;

    let config: Config = toml::from_str(&content)
        .context("Failed to parse config file")?;

    Ok(config)
}

/// Build config from environment variables when no config file exists.
fn config_from_env() -> Result<Config> {
    let mut providers = HashMap::new();

    // Check for ANTHROPIC_API_KEY
    if let Ok(key) = std::env::var("ANTHROPIC_API_KEY") {
        providers.insert("anthropic".to_string(), ProviderConfig {
            api_key: key,
            model: std::env::var("ANTHROPIC_MODEL")
                .unwrap_or_else(|_| "claude-sonnet-4-20250514".to_string()),
            base_url: None,
        });
    }

    // Check for OPENAI_API_KEY
    if let Ok(key) = std::env::var("OPENAI_API_KEY") {
        providers.insert("openai".to_string(), ProviderConfig {
            api_key: key,
            model: std::env::var("OPENAI_MODEL")
                .unwrap_or_else(|_| "gpt-4o".to_string()),
            base_url: None,
        });
    }

    if providers.is_empty() {
        anyhow::bail!(
            "No config file found and no API keys in environment.\n\
             Either create ~/.config/deckforge/config.toml or set \
             ANTHROPIC_API_KEY / OPENAI_API_KEY."
        );
    }

    let default_provider = if providers.contains_key("anthropic") {
        "anthropic"
    } else {
        providers.keys().next().unwrap()
    }.to_string();

    Ok(Config {
        default_provider,
        providers,
    })
}
