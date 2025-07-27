package com.ace.templateengine.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI aceTemplateEngineOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Development server");

        Contact contact = new Contact();
        contact.setEmail("support@acetemplate.com");
        contact.setName("ACE Template Engine");
        contact.setUrl("https://github.com/ace-template/ace-template-engine");

        License license = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("ACE Template Engine API")
                .version("1.0.0")
                .contact(contact)
                .description("API documentation for ACE Template Engine - A comprehensive dynamic UI builder with real-time component management, data integration, and visual application development capabilities.")
                .termsOfService("https://acetemplate.com/terms")
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer));
    }
}
