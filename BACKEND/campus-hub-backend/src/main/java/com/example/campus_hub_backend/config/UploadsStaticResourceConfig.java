package com.example.campus_hub_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadsStaticResourceConfig implements WebMvcConfigurer {
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Serve locally saved upload files (e.g. uploads/tickets/<file>) via /uploads/**.
    // This makes <img src="http://localhost:8088/uploads/..."> work in the frontend.
    registry.addResourceHandler("/uploads/**")
        // Try multiple candidate locations because the relative upload path depends on the
        // current working directory when Spring Boot starts.
        .addResourceLocations(
            "file:uploads/",
            "file:../uploads/",
            "file:../../uploads/"
        );
  }
}

