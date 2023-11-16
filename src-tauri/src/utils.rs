use base64::{engine::general_purpose, Engine as _};
use image::Rgba;
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};

#[tauri::command]
pub fn binary_to_base64(binary: Vec<u8>) -> String {
    // 处理传入的 Buffer 并将其转换为 Base64 编码
    let base64_string = general_purpose::STANDARD.encode(&binary);

    base64_string
}

#[tauri::command]
pub fn rand_string() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(6)
        .map(char::from)
        .collect()
}

pub fn hex_to_rgba(hex_color: &str) -> Rgba<u8> {
    let hex = hex_color.trim_start_matches('#');

    if hex.len() == 6 {
        if let Ok(color) = u32::from_str_radix(hex, 16) {
            let red = ((color >> 16) & 0xFF) as u8;
            let green = ((color >> 8) & 0xFF) as u8;
            let blue = (color & 0xFF) as u8;

            return Rgba([red, green, blue, 255]);
        }
    } else if hex.len() == 8 {
        if let Ok(color) = u32::from_str_radix(hex, 16) {
            let red = ((color >> 24) & 0xFF) as u8;
            let green = ((color >> 16) & 0xFF) as u8;
            let blue = ((color >> 8) & 0xFF) as u8;
            let alpha = (color & 0xFF) as u8;

            return Rgba([red, green, blue, alpha]);
        }
    }

    // 默认返回黑色
    Rgba([255, 255, 255, 255])
}
