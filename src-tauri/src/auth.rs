use reqwest::Client;
use std::env;
use tauri::State;
use url::Url;

use crate::model::{AuthConfig, User, UserConfig, UserState, UserToken};

const BASE_LOGIN_URL: &str = "https://github.com/login/oauth/authorize";
const BASE_AUTHORIZE: &str = "https://github.com/login/oauth/access_token";
const BASE_USER: &str = "https://api.github.com/user";

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
pub async fn get_access_token(code: String, state: tauri::State<UserState>) -> UserConfig {
    let mut user_state = state.lock().unwrap();
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
    user_state.set(Some(user_token.clone()), None);
    // let mut user_token = UserToken::new();
    // user_token.set(res);

    if let Some(token) = user_state.token.access_token.as_ref().clone() {
        let token = format!("Bearer {}", token);
        let user = client
            .get(BASE_USER)
            .header("Accept", "application/json")
            .header("Authorization", token)
            .header("User-Agent", "picx-app")
            .send()
            .await
            .unwrap()
            .json::<User>()
            .await
            .unwrap();

        user_state.set(Some(user_token), Some(user));

        return UserConfig {
            token: user_state.token.clone(),
            user: user_state.user.clone(),
        };
    }
    UserConfig {
        token: user_state.token.clone(),
        user: user_state.user.clone(),
    }
}

#[tauri::command]
pub fn login_uri() -> String {
    let config = read_auth_env();
    let params = vec![
        ("client_id", &config.client_id),
        ("redirect_uri", &config.redirect_uri),
        ("state", &config.state),
    ];
    let uri = Url::parse_with_params(BASE_LOGIN_URL, params)
        .unwrap()
        .to_string();

    uri
}

#[tauri::command]
pub fn get_user_state(state: State<UserState>) -> UserConfig {
    let user_state = state.lock().unwrap();
    user_state.clone()
}
