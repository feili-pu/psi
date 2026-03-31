package com.lifei.psi.config;

import com.lifei.psi.interceptor.PermissionInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web 配置类
 * 用于配置拦截器等
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private PermissionInterceptor permissionInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(permissionInterceptor)
                .addPathPatterns("/api/**")  // 拦截所有 API 请求
                .excludePathPatterns(
                        "/api/auth/**",      // 排除认证相关接口
                        "/api/public/**",    // 排除公共接口
                        "/swagger-ui/**",    // 排除 Swagger UI
                        "/v3/api-docs/**",   // 排除 API 文档
                        "/swagger-resources/**",
                        "/webjars/**"
                );
    }
}
