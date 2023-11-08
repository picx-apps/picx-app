use std::fs::File;
use std::io::Read;

use image::codecs::jpeg::JpegEncoder;
use image::codecs::png::{CompressionType, FilterType, PngEncoder};
use image::ImageFormat;

#[tauri::command]
pub fn image_to_base64(path: &str) -> String {
    image_base64::to_base64(path)
}

#[tauri::command]
pub fn compression_image(path: &str, quality: u8) -> Vec<u8> {
    let image_data = read_image(path).expect("Failed to read image");
    let image = image::load_from_memory(&image_data).expect("Failed to load image");
    // 创建一个空的字节数组作为输出缓冲区
    let mut compressed_image_data = Vec::new();
    let format = image::guess_format(&image_data).expect("Failed to guess image format");

    match format {
        ImageFormat::Jpeg => {
            let encoder = JpegEncoder::new_with_quality(&mut compressed_image_data, quality);
            image
                .write_with_encoder(encoder)
                .expect("Failed to compression image");
            compressed_image_data
        }
        ImageFormat::Png => {
            let encoder = PngEncoder::new_with_quality(
                &mut compressed_image_data,
                CompressionType::Default,
                FilterType::NoFilter,
            );
            image
                .write_with_encoder(encoder)
                .expect("Failed to compression image");
            compressed_image_data
        }
        _ => image_data,
    }
}

fn read_image(path: &str) -> Option<Vec<u8>> {
    let mut file = File::open(path).ok()?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).ok()?;
    Some(buffer)
}
