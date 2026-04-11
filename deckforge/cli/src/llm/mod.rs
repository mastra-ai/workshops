mod anthropic;
mod openai;

use anyhow::{Context, Result};
use crate::config::ProviderConfig;
use crate::slide::Suggestion;

/// Trait for LLM providers — each must be able to analyze a slide and return suggestions.
#[async_trait::async_trait]
pub trait LlmClient: Send + Sync {
    async fn get_suggestions(
        &self,
        filename: &str,
        title: &str,
        html: &str,
        component_ref: &str,
    ) -> Result<Vec<Suggestion>>;
}

/// Create the appropriate LLM client based on provider name.
pub fn create_client(
    provider: &str,
    config: &ProviderConfig,
    model: &str,
) -> Result<Box<dyn LlmClient>> {
    match provider {
        "anthropic" => Ok(Box::new(anthropic::AnthropicClient::new(config, model)?)),
        "openai" => Ok(Box::new(openai::OpenAiClient::new(config, model)?)),
        other => {
            // Treat as OpenAI-compatible with custom base_url
            let base_url = config.base_url.as_deref()
                .context(format!(
                    "Provider '{}' requires a base_url in config (OpenAI-compatible API)",
                    other
                ))?;
            Ok(Box::new(openai::OpenAiClient::new_with_base(config, model, base_url)?))
        }
    }
}

/// Build the system prompt for the enhancement advisor.
pub fn system_prompt(component_ref: &str) -> String {
    format!(
        r#"You are a presentation design advisor for DeckForge. You review HTML slide files and suggest visual enhancements.

Your suggestions must use ONLY the CSS classes and JS functions available in the DeckForge theme. Do not invent new classes.

## Component Reference
{component_ref}

## Response Format

Respond with a JSON array of suggestion objects:
```json
[
  {{
    "name": "Short enhancement name",
    "description": "What this enhancement does and why it improves the slide",
    "visual_impact": "What the audience sees differently",
    "css_additions": "Any CSS to add in a <style> block (empty string if none)",
    "js_additions": "Any JS to add in a <script> block (empty string if none)",
    "html_diff": "Description of HTML changes to make (structural, class additions, etc.)"
  }}
]
```

Rules:
- Return 2-5 suggestions per slide
- Each suggestion must be independently applicable
- Never alter the slide's textual content
- Preserve navigation elements (topnav, initKeyNav)
- Prefer subtle, professional animations over flashy effects
- Use existing CSS variables for all colors
- Respond ONLY with the JSON array, no other text"#,
    )
}
