use anyhow::{Context, Result};
use reqwest::Client;
use serde_json::{json, Value};

use crate::config::ProviderConfig;
use crate::slide::Suggestion;
use super::LlmClient;

const DEFAULT_BASE_URL: &str = "https://api.openai.com/v1";

pub struct OpenAiClient {
    client: Client,
    api_key: String,
    model: String,
    base_url: String,
}

impl OpenAiClient {
    pub fn new(config: &ProviderConfig, model: &str) -> Result<Self> {
        Ok(Self {
            client: Client::new(),
            api_key: config.api_key.clone(),
            model: model.to_string(),
            base_url: DEFAULT_BASE_URL.to_string(),
        })
    }

    pub fn new_with_base(config: &ProviderConfig, model: &str, base_url: &str) -> Result<Self> {
        Ok(Self {
            client: Client::new(),
            api_key: config.api_key.clone(),
            model: model.to_string(),
            base_url: base_url.trim_end_matches('/').to_string(),
        })
    }
}

#[async_trait::async_trait]
impl LlmClient for OpenAiClient {
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
            "messages": [
                { "role": "system", "content": system },
                { "role": "user", "content": user_msg }
            ],
            "temperature": 0.7,
            "max_tokens": 4096,
        });

        let url = format!("{}/chat/completions", self.base_url);

        let resp = self.client
            .post(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&body)
            .send()
            .await
            .context("Failed to call OpenAI-compatible API")?;

        let status = resp.status();
        let resp_body: Value = resp.json().await
            .context("Failed to parse API response")?;

        if !status.is_success() {
            anyhow::bail!(
                "API error ({}): {}",
                status,
                serde_json::to_string_pretty(&resp_body)?
            );
        }

        let text = resp_body["choices"][0]["message"]["content"]
            .as_str()
            .context("No content in API response")?;

        parse_suggestions(text)
    }
}

fn parse_suggestions(text: &str) -> Result<Vec<Suggestion>> {
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
