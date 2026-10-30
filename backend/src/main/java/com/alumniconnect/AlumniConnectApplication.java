package com.alumniconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AlumniConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlumniConnectApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 AlumniConnect Backend is running on port 8080!");
        System.out.println("   MySQL Connected: alumni_platform @ localhost:3306");
        System.out.println("=================================================");
    }
}

