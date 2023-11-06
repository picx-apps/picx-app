#[tauri::command]
pub fn image_to_base64(path: &str) -> String {
    image_base64::to_base64(path)
}
