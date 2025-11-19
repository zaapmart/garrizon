package com.garrizon.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return (String) uploadResult.get("secure_url");
    }

    public void deleteImage(String imageUrl) throws IOException {
        // Extract public ID from URL
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
        // Public ID: sample
        
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        
        String publicId = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
