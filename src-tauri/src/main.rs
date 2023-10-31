// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod model;

use std::sync::{Arc, Mutex};

use auth::{get_access_token, get_user_state, login_uri};
use dotenv::dotenv;
use model::{UserConfig, UserState, UserToken};

fn main() {
    dotenv().ok();

    let user_state: UserState = Arc::new(Mutex::new(UserConfig {
        token: UserToken::new(),
        user: None,
    }));

    tauri::Builder::default()
        .manage(user_state.clone())
        .invoke_handler(tauri::generate_handler![
            get_access_token,
            login_uri,
            get_user_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
