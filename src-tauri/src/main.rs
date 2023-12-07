// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod image;
mod model;
mod utils;

use auth::{sign_jwt, sign_out};
use dotenv::dotenv;
use image::{compression_image, compression_image_buf, watermark_image};
use model::SchemePayload;
use tauri::Manager;
use utils::{binary_to_base64, rand_string};

fn main() {
    dotenv().ok();
    tauri_plugin_deep_link::prepare("picx-app");

    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            tauri_plugin_deep_link::register("picx", move |request| {
                if request.is_empty() {
                    return;
                }
                let payload: Vec<&str> = request[7..].split("?").collect();
                let scheme_payload = SchemePayload {
                    base: payload[0].to_string(),
                    query: payload[1].to_string(),
                };
                handle
                    .emit_all("scheme-request-received", scheme_payload)
                    .unwrap();
            })
            .unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            sign_out,
            binary_to_base64,
            compression_image,
            rand_string,
            sign_jwt,
            watermark_image,
            compression_image_buf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
