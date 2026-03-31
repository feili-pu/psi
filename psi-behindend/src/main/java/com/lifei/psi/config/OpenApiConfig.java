package com.lifei.psi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

/**
 * OpenAPI/Swagger配置类
 * 用于自动生成API接口文档
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PSI进销存管理系统 API")
                        .description("## 系统简介\n" +
                                "基于Spring Boot开发的进销存管理系统，提供完整的采购、销售、库存管理功能。\n\n" +
                                "## 主要功能模块\n" +
                                "- **采购管理**: 采购申请、询价、报价、比价、订单管理\n" +
                                "- **库存管理**: 生产出入库、物料管理、序列号管理\n" +
                                "- **销售管理**: 销售订单、报价单管理\n" +
                                "- **统计分析**: 各类业务统计报表\n\n" +
                                "## 技术栈\n" +
                                "- Spring Boot 2.7.18\n" +
                                "- MyBatis\n" +
                                "- MySQL 8.0\n" +
                                "- Swagger/OpenAPI 3.0")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("开发团队")
                                .email("developer@example.com")
                                .url("https://example.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(Arrays.asList(
                        new Server()
                                .url("http://localhost:8080")
                                .description("开发环境"),
                        new Server()
                                .url("https://api.example.com")
                                .description("生产环境")
                ));
    }
}