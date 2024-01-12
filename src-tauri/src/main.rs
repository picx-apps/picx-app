// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod image;
mod model;
mod utils;

use auth::{get_access_token, sign_jwt, sign_out};
use image::{compression_image, compression_image_buf, watermark_image};
use utils::{binary_to_base64, rand_string};

fn main() {
    use tauri::Manager;
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
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
