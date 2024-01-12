use crate::model::{AuthConfig, Claims, UserToken};
use chrono::prelude::*;
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use reqwest::Client;
use std::collections::HashMap;

const BASE_AUTHORIZE: &str = "https://github.com/login/oauth/access_token";

#[tauri::command]
pub async fn get_access_token(config: AuthConfig) -> Result<UserToken, String> {
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
        .await;

    match user_token {
        Ok(v) => Ok(v.json::<UserToken>().await.unwrap()),
        Err(e) => Err(e.to_string()),
    }
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

#[tauri::command]
pub fn sign_jwt(private_key: String) -> Result<String, String> {
    let now = Local::now().timestamp();
    let claims = Claims {
        iat: now.clone() - 60,
        exp: now.clone() + 600,
        iss: String::from("794444"),
    };
    let private_key = EncodingKey::from_rsa_pem(private_key.as_bytes());
    match private_key {
        Ok(encoding_key) => {
            let token = encode(&Header::new(Algorithm::RS256), &claims, &encoding_key).unwrap();
            Ok(token)
        }
        Err(_) => Err("Parsing error with private key".into()),
    }
}
