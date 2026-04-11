use anyhow::{Context, Result};
use reqwest::Client;
use serde_json::{json, Value};

use crate::config::ProviderConfig;
use crate::slide::Suggestion;
use super::LlmClient;

pub struct AnthropicClient {
    client: Client,
    api_key: String,
    model: String,
}

impl AnthropicClient {
    pub fn new(config: &ProviderConfig, model: &str) -> Result<Self> {
        Ok(Self {
            client: Client::new(),
            api_key: config.api_key.clone(),
            model: model.to_string(),
        })
    }
}

#[async_trait::async_trait]
impl LlmClient for AnthropicClient {
    async fn get_suggestions(
        &self,
        filename: &str,
        title: &str,
        html: &str,
        component_ref: &str,
    ) -> Result<Vec<Suggestion>> {
        let system = super::system_prompt(component_ref);
        let user_msg = format!(
            "Review this slide and suggest enhancements.\n\n\
             Filename: {filename}\n\
             Title: {title}\n\n\
             ```html\n{html}\n```"
        );

        let body = json!({
            "model": self.model,
            "max_tokens": 4096,
            "system": system,
            "messages": [
                { "role": "user", "content": user_msg }
            ]
        });

        let resp = self.client
            .post("https://api.anthropic.com/v1/messages")
            .header("x-api-key", &self.api_key)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
            .json(&body)
            .send()
            .await
            .context("Failed to call Anthropic API")?;

        let status = resp.status();
        let resp_body: Value = resp.json().await
            .context("Failed to parse Anthropic response")?;

        if !status.is_success() {
            anyhow::bail!(
                "Anthropic API error ({}): {}",
                status,
                serde_json::to_string_pretty(&resp_body)?
            );
        }

        // Extract text content from response
        let text = resp_body["content"][0]["text"]
            .as_str()
            .context("No text in Anthropic response")?;

        parse_suggestions(text)
    }
}

fn parse_suggestions(text: &str) -> Result<Vec<Suggestion>> {
    // The response should be a JSON array, possibly wrapped in markdown code fences
    let cleaned = text
        .trim()
        .trim_start_matches("```json")
        .trim_start_matches("```")
        .trim_end_matches("```")
        .trim();

    let suggestions: Vec<Suggestion> = serde_json::from_str(cleaned)
        .context("Failed to parse suggestions JSON from LLM response")?;

    Ok(suggestions)
}
