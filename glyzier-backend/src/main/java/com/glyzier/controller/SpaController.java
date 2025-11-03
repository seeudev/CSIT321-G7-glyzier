package com.glyzier.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * SPA (Single Page Application) Controller
 * 
 * This controller handles routing for the React frontend.
 * It forwards all non-API requests to index.html, allowing React Router
 * to handle client-side routing.
 * 
 * How it works:
 * - API requests (/api/**) are handled by REST controllers
 * - Static resources (CSS, JS, images) are served from /static
 * - All other routes (/, /login, /dashboard, etc.) forward to index.html
 * - React Router then handles the routing on the client side
 * 
 * This is necessary because React Router uses the HTML5 History API,
 * which means routes like /dashboard don't actually exist on the server.
 * We need to return index.html for all routes and let React handle them.
 * 
 * @author Glyzier Team
 * @version 2.0 - Simplified architecture
 */
@Controller
public class SpaController {

    /**
     * Forward all non-API routes to index.html
     * 
     * This method catches all GET requests that don't match:
     * - /api/** (REST endpoints)
     * - /static/** (static resources)
     * - /error (error handling)
     * 
     * The {path:[^\\.]*} pattern matches any path that doesn't contain a dot,
     * which prevents static file requests (like .js, .css, .png) from being forwarded.
     * 
     * Examples:
     * - GET / → forward:/index.html (home page)
     * - GET /login → forward:/index.html (React Router handles)
     * - GET /dashboard → forward:/index.html (React Router handles)
     * - GET /products/123 → forward:/index.html (React Router handles)
     * - GET /api/products → handled by ProductController
     * - GET /assets/main.js → served from /static/assets/main.js
     * 
     * @return Forward path to index.html
     */
    @GetMapping(value = "/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
