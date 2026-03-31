package com.lifei.psi.controller;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * API文档重定向控制器
 */
@Controller
@Hidden // 在Swagger文档中隐藏此控制器
public class ApiDocController {

    /**
     * 重定向到Swagger UI页面
     */
    @GetMapping("/")
    public String redirectToSwagger() {
        return "redirect:/swagger-ui.html";
    }

    /**
     * API文档页面
     */
    @GetMapping("/docs")
    public String apiDocs() {
        return "redirect:/swagger-ui.html";
    }
}