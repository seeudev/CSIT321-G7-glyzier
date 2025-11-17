package com.glyzier.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Web MVC Configuration
 * 
 * This configuration handles React SPA routing by forwarding all non-API,
 * non-static requests to index.html.
 * 
 * This approach is better than using a @Controller because:
 * 1. It doesn't interfere with @RestController mappings
 * 2. It properly handles static resources
 * 3. It's the recommended way to serve SPAs in Spring Boot
 * 
 * How it works:
 * - API requests (/api/**) go to RestControllers
 * - Static files (/*.js, /*.css, /assets/**) are served normally
 * - All other requests fall through to index.html for React Router
 * 
 * @author Glyzier Team
 * @version 2.0
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Configure resource handlers to serve static files and forward SPA routes
     * 
     * This sets up a resource handler for "/**" (all paths) that:
     * 1. Tries to find the requested resource in classpath:/static/
     * 2. If not found, returns index.html (for React Router paths)
     * 3. Doesn't interfere with API endpoints (they're handled before this)
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // If the resource exists, return it (static files)
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // If path starts with /api, don't fall through to index.html
                        // This prevents API 404s from returning HTML
                        if (resourcePath.startsWith("api/")) {
                            return null;
                        }
                        
                        // For all other paths, return index.html (React Router will handle it)
                        return new ClassPathResource("/static/index.html");
                    }
                });
    }
}
