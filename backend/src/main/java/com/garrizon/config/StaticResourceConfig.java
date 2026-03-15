package com.garrizon.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map /media/** to the external folder
        // Note: 'file:' prefix is required for absolute file system paths.
        // Ensure the directory exists and has read permissions.
        registry.addResourceHandler("/media/**")
                .addResourceLocations("file:/var/www/garrizon-bucket/");
    }
}
