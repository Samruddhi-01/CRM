package com.startica.privateapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {
    "com.startica.privateapp"
})
public class PrivateAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrivateAppApplication.class, args);
    }

}
