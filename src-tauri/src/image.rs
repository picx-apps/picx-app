use std::fs::File;
use std::io::{Cursor, Read};

use crate::utils::{binary_to_base64, hex_to_rgba};
use image::codecs::jpeg::JpegEncoder;
use image::codecs::png::{CompressionType, FilterType, PngEncoder};
use image::{GenericImage, ImageBuffer, ImageFormat, Rgba};
use imageproc::drawing::draw_text_mut;
use rusttype::{Font, Scale};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct CompressionImage {
    buffer: Vec<u8>,
    base64: String,
    compression_buffer: Vec<u8>,
    compression_base64: String,
}

#[derive(Deserialize, Debug)]
pub enum CompressionQuality {
    Default,
    Fast,
    Best,
}

#[tauri::command]
pub fn compression_image(
    path: &str,
    compression_quality: Option<CompressionQuality>,
) -> CompressionImage {
    let image_data = read_image(path).expect("Failed to read image");
    compression_image_buf(image_data, compression_quality)
}

#[tauri::command]
pub fn compression_image_buf(
    origin: Vec<u8>,
    compression_quality: Option<CompressionQuality>,
) -> CompressionImage {
    let image = image::load_from_memory(&origin).expect("Failed to load image");
    // 创建一个空的字节数组作为输出缓冲区
    let mut compressed_image_data = Vec::new();
    let format = image::guess_format(&origin).expect("Failed to guess image format");
    if compression_quality.is_none() {
        return CompressionImage {
            buffer: origin.clone(),
            base64: binary_to_base64(origin.clone()),
            compression_buffer: origin.clone(),
            compression_base64: binary_to_base64(origin),
        };
    };

    let compression_quality = compression_quality.unwrap();
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
            CompressionImage {
                buffer: origin.clone(),
                base64: binary_to_base64(origin),
                compression_buffer: compressed_image_data.clone(),
                compression_base64: binary_to_base64(compressed_image_data),
            }
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
            CompressionImage {
                buffer: origin.clone(),
                base64: binary_to_base64(origin),
                compression_buffer: compressed_image_data.clone(),
                compression_base64: binary_to_base64(compressed_image_data),
            }
        }
        _ => CompressionImage {
            buffer: origin.clone(),
            base64: binary_to_base64(origin.clone()),
            compression_buffer: origin.clone(),
            compression_base64: binary_to_base64(origin),
        },
    }
}

fn read_image(path: &str) -> Option<Vec<u8>> {
    let mut file = File::open(path).ok()?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).ok()?;
    Some(buffer)
}

#[derive(Deserialize, Serialize, Debug)]
pub struct WatermarkOptions {
    pub text: String,
    pub top: i32,
    pub left: i32,
    pub size: f32,
    pub font_color: String,
}

#[tauri::command]
pub fn watermark_image(image: Vec<u8>, options: WatermarkOptions) -> String {
    let format = image::guess_format(&image).expect("Failed to guess image format");
    let dynamic_image = image::load_from_memory(&image).expect("Failed to load image");
    let width = &dynamic_image.width();
    let height = &dynamic_image.height();
    // 创建一个可编辑的图像副本
    let mut edited_image = ImageBuffer::from_pixel(*width, *height, Rgba([0, 0, 0, 0]));
    // 将原始图像复制到可编辑图像上
    edited_image.copy_from(&dynamic_image, 0, 0).unwrap();
    //水印字体
    let font_data: &[u8] = include_bytes!("./assets/ShuHeiTi-Bold.ttf");
    let font: Font<'static> = Font::try_from_bytes(font_data).expect("cannot find font");
    //字体大小
    let watermark_font_size = Scale {
        x: options.size,
        y: options.size,
    };
    //字体颜色
    let watermark_color = hex_to_rgba(&options.font_color);
    println!("watermark_color is {:?}", watermark_color);
    //水印位置
    let relative_top = ((height / 100) as i32) * options.top;
    let relative_left = ((width / 100) as i32) * options.left;

    draw_text_mut(
        &mut edited_image,
        watermark_color,
        relative_left,
        relative_top,
        watermark_font_size,
        &font,
        &options.text,
    );
    //将图片写入缓存区
    let mut buff = Cursor::new(Vec::new());
    edited_image.write_to(&mut buff, format).unwrap();
    //缓存区转base64
    binary_to_base64(buff.into_inner())
}
