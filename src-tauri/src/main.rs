// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod model;

use auth::{get_access_token, login_uri};
use dotenv::dotenv;

fn main() {
    dotenv().ok();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_access_token, login_uri,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
