package com.garrizon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GarrizonApplication {

    public static void main(String[] args) {
        SpringApplication.run(GarrizonApplication.class, args);
    }
}
