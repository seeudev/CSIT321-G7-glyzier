package com.glyzier.glyzier_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.glyzier"})
@EnableJpaRepositories(basePackages = "com.glyzier.repository")
@EntityScan(basePackages = "com.glyzier.model")
public class GlyzierApplication {

	public static void main(String[] args) {
		SpringApplication.run(GlyzierApplication.class, args);
	}

}
