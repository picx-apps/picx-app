use base64::{engine::general_purpose, Engine as _};

#[tauri::command]
pub fn binary_to_base64(binary: Vec<u8>) -> String {
    // 处理传入的 Buffer 并将其转换为 Base64 编码
    let base64_string = general_purpose::STANDARD.encode(&binary);

    base64_string
}
