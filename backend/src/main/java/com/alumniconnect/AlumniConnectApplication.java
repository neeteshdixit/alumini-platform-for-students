package com.alumniconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AlumniConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlumniConnectApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("🚀 AlumniConnect Backend running on Port 8080!");
        System.out.println("🐘 Connected to PostgreSQL Database: alumni_platform");
        System.out.println("==========================================================");
    }
}