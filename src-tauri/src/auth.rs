use crate::model::Claims;
use chrono::prelude::*;
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use reqwest::Client;
use std::{collections::HashMap, env};

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
pub fn sign_jwt() -> String {
    let now = Local::now().timestamp();
    let claims = Claims {
        iat: now.clone() - 60,
        exp: now.clone() + 600,
        iss: String::from("416113"),
    };
    let private_key_str =
        env::var("PICX_PRIVATE_KEY").expect("Failed to read PICX_PRIVATE_KEY from environment");
    let private_key = EncodingKey::from_rsa_pem(private_key_str.as_bytes()).unwrap();
    let token = encode(&Header::new(Algorithm::RS256), &claims, &private_key).unwrap();
    token
}
