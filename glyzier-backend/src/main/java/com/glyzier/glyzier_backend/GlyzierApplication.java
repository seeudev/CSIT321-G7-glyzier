package com.glyzier.glyzier_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Main Application Class for Glyzier
 * 
 * This is the entry point for the Spring Boot application.
 * The @SpringBootApplication annotation enables auto-configuration,
 * component scanning, and configuration support.
 * 
 * We specify the base package "com.glyzier" to ensure all components
 * (controllers, services, repositories, etc.) are scanned and registered.
 * 
 * @EnableJpaRepositories - Enables JPA repositories in the specified package
 * @EntityScan - Scans for JPA entities in the specified package
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@SpringBootApplication(scanBasePackages = "com.glyzier")
@EnableJpaRepositories(basePackages = "com.glyzier.repository")
@EntityScan(basePackages = "com.glyzier.model")
public class GlyzierApplication {

	public static void main(String[] args) {
		SpringApplication.run(GlyzierApplication.class, args);
	}

}
