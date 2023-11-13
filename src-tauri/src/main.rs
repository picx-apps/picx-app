// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod image;
mod model;
mod utils;

use auth::{get_access_token, login_uri, sign_out};
use dotenv::dotenv;
use image::compression_image;
use tauri::Manager;
use utils::{binary_to_base64, rand_string};

fn main() {
    dotenv().ok();
    tauri_plugin_deep_link::prepare("picx-app");

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .setup(|app| {
            let handle = app.handle();
            tauri_plugin_deep_link::register("picx", move |request| {
                handle.emit_all("scheme-request-received", request).unwrap();
            })
            .unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_access_token,
            login_uri,
            sign_out,
            binary_to_base64,
            compression_image,
            rand_string
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
