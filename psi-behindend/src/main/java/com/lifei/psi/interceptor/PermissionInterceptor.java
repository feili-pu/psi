package com.lifei.psi.interceptor;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.service.UserService;
import com.lifei.psi.util.JwtUtil;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;

/**
 * 权限拦截器
 * 用于检查用户是否拥有访问特定资源的权限
 */
@Component
public class PermissionInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 只处理方法级别的请求
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();
        Class<?> clazz = handlerMethod.getBeanType();

        // 检查方法上的权限注解
        RequirePermission methodAnnotation = method.getAnnotation(RequirePermission.class);
        // 检查类上的权限注解
        RequirePermission classAnnotation = clazz.getAnnotation(RequirePermission.class);

        // 如果方法和类都没有权限注解，则允许访问
        if (methodAnnotation == null && classAnnotation == null) {
            return true;
        }

        // 优先使用方法上的注解，如果没有则使用类上的注解
        RequirePermission annotation = methodAnnotation != null ? methodAnnotation : classAnnotation;

        // 从请求中获取用户ID（这里需要根据你的认证机制来获取）
        Long userId = getCurrentUserId(request);
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"未登录或登录已过期\",\"code\":401}");
            return false;
        }

        // 如果允许管理员跳过权限检查，先检查是否为管理员
        if (annotation.allowAdmin() && isAdmin(userId)) {
            return true;
        }

        // 检查权限
        boolean hasPermission = checkPermission(userId, annotation);
        
        if (!hasPermission) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            String message = annotation.message();
            response.getWriter().write("{\"error\":\"" + message + "\",\"code\":403}");
            return false;
        }

        return true;
    }

    /**
     * 从请求中获取当前用户ID
     * 这里需要根据你的认证机制来实现
     * 可能从 JWT token、Session 或其他方式获取
     */
    private Long getCurrentUserId(HttpServletRequest request) {
        // 优先从 Authorization header 中获取 JWT token
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
                    return jwtUtil.getUserIdFromToken(token);
                }
            } catch (Exception e) {
                // JWT token 解析失败，继续尝试其他方式
            }
        }

        // 示例：从请求头中获取用户ID
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            try {
                return Long.parseLong(userIdHeader);
            } catch (NumberFormatException e) {
                return null;
            }
        }

        // 示例：从 Session 中获取用户ID
        Object userId = request.getSession().getAttribute("userId");
        if (userId instanceof Long) {
            return (Long) userId;
        }

        // 如果所有方式都失败，返回null表示未认证
        return null;
    }

    /**
     * 检查用户是否为管理员
     */
    private boolean isAdmin(Long userId) {
        try {
            return userService.hasRole(userId, "ADMIN");
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 检查用户权限
     */
    private boolean checkPermission(Long userId, RequirePermission annotation) {
        String[] permissions = annotation.value();
        RequirePermission.LogicalOperator logical = annotation.logical();

        try {
            if (logical == RequirePermission.LogicalOperator.AND) {
                // AND 模式：需要拥有所有权限
                for (String permission : permissions) {
                    if (!userService.hasPermission(userId, permission)) {
                        return false;
                    }
                }
                return true;
            } else {
                // OR 模式：只需要拥有其中一个权限
                for (String permission : permissions) {
                    if (userService.hasPermission(userId, permission)) {
                        return true;
                    }
                }
                return false;
            }
        } catch (Exception e) {
            // 如果检查权限时出现异常，默认拒绝访问
            return false;
        }
    }
}
