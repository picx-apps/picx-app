// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod image;
mod model;
mod utils;

use auth::{get_access_token, login_uri};
use dotenv::dotenv;
use image::image_to_base64;
use utils::binary_to_base64;

fn main() {
    dotenv().ok();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_access_token,
            login_uri,
            image_to_base64,
            binary_to_base64
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
