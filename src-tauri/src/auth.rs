use reqwest::Client;
use std::{collections::HashMap, env, fmt::format};
use url::Url;

use crate::model::{AuthConfig, UserToken};

const BASE_LOGIN_URL: &str = "https://github.com/login/oauth/authorize";
const BASE_AUTHORIZE: &str = "https://github.com/login/oauth/access_token";

fn read_auth_env() -> AuthConfig {
    let mut auth_config = AuthConfig::default();
    auth_config.client_id = env::var("CLIENT_ID").unwrap_or(String::new());
    auth_config.client_secret = env::var("CLIENT_SECRET").unwrap_or(String::new());
    auth_config.redirect_uri = env::var("REDIRECT_URI").unwrap_or(String::new());
    auth_config.state = env::var("GITHUB_STATE").unwrap_or(String::new());

    auth_config
}

#[tokio::main]
#[tauri::command]
pub async fn get_access_token(code: String) -> UserToken {
    let mut config = read_auth_env();
    config.code = code;

    let params = vec![
        ("code", config.code),
        ("client_id", config.client_id),
        ("client_secret", config.client_secret),
        ("redirect_uri", config.redirect_uri),
    ];

    let client = Client::new();
    let user_token = client
        .post(BASE_AUTHORIZE)
        .header("Accept", "application/json")
        .form(&params)
        .send()
        .await
        .unwrap()
        .json::<UserToken>()
        .await
        .unwrap();

    user_token
}

#[tauri::command]
pub fn login_uri() -> String {
    let config = read_auth_env();
    let scope = String::from("user repo project");
    let params = vec![
        ("client_id", &config.client_id),
        ("redirect_uri", &config.redirect_uri),
        ("state", &config.state),
        ("scope", &scope),
    ];
    let uri = Url::parse_with_params(BASE_LOGIN_URL, params)
        .unwrap()
        .to_string();

    uri
}

#[tauri::command]
pub async fn sign_out(token: String) -> u16 {
    let mut map = HashMap::new();
    map.insert("access_token", &token);
    let client = Client::new();
    let status = client
        .delete("https://github.com/installation/token")
        .header("Accept", "application/vnd.github+json")
        .header("Authorization", format!("token {}", &token))
        .send()
        .await
        .unwrap()
        .status();
    println!("{}", status.as_u16());
    status.as_u16()
}
