// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod image;
mod model;
mod utils;

use auth::{get_access_token, sign_jwt, sign_out};
use dotenv::dotenv;
use image::{compression_image, compression_image_buf, watermark_image};
use utils::{binary_to_base64, rand_string};

fn main() {
    dotenv().ok();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            sign_out,
            binary_to_base64,
            compression_image,
            rand_string,
            sign_jwt,
            watermark_image,
            compression_image_buf,
            get_access_token
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
