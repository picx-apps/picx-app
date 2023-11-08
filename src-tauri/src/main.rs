// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod image;
mod model;
mod utils;

use auth::{get_access_token, login_uri};
use dotenv::dotenv;
use image::compression_image;
use utils::{binary_to_base64, rand_string};

fn main() {
    dotenv().ok();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_access_token,
            login_uri,
            binary_to_base64,
            compression_image,
            rand_string
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
