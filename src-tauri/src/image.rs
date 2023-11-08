use std::fs::File;
use std::io::Read;

use crate::utils::binary_to_base64;
use image::codecs::jpeg::JpegEncoder;
use image::codecs::png::{CompressionType, FilterType, PngEncoder};
use image::ImageFormat;
use serde::Deserialize;

#[tauri::command]
pub fn image_to_base64(path: &str) -> String {
    let image_data = read_image(path).expect("Failed to read image");
    binary_to_base64(image_data)
}

#[derive(Deserialize, Debug)]
pub enum CompressionQuality {
    Default,
    Fast,
    Best,
}

#[tauri::command]
pub fn compression_image(path: &str, compression_quality: CompressionQuality) -> Vec<u8> {
    let image_data = read_image(path).expect("Failed to read image");
    let image = image::load_from_memory(&image_data).expect("Failed to load image");
    // 创建一个空的字节数组作为输出缓冲区
    let mut compressed_image_data = Vec::new();
    let format = image::guess_format(&image_data).expect("Failed to guess image format");
    let rate = match compression_quality {
        CompressionQuality::Default => 60,
        CompressionQuality::Fast => 80,
        CompressionQuality::Best => 45,
    };
    let compression_type = match compression_quality {
        CompressionQuality::Default => CompressionType::Default,
        CompressionQuality::Fast => CompressionType::Fast,
        CompressionQuality::Best => CompressionType::Best,
    };

    match format {
        ImageFormat::Jpeg => {
            let encoder = JpegEncoder::new_with_quality(&mut compressed_image_data, rate);
            image
                .write_with_encoder(encoder)
                .expect("Failed to compression image");
            compressed_image_data
        }
        ImageFormat::Png => {
            let encoder = PngEncoder::new_with_quality(
                &mut compressed_image_data,
                compression_type,
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
