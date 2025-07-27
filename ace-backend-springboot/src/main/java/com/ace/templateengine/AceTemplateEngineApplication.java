package com.ace.templateengine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;

@SpringBootApplication(exclude = {MongoAutoConfiguration.class})
public class AceTemplateEngineApplication {

    public static void main(String[] args) {
        SpringApplication.run(AceTemplateEngineApplication.class, args);
    }

}
