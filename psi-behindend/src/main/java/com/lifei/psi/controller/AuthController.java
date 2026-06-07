package com.lifei.psi.controller;

import com.lifei.psi.dto.LoginRequest;
import com.lifei.psi.entity.User;
import com.lifei.psi.entity.Role;
import com.lifei.psi.service.UserService;
import com.lifei.psi.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "认证管理", description = "用户登录认证")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户名密码登录，返回JWT Token")
    public Map<String, Object> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 验证用户名和密码
            User user = userService.getUserByUsername(loginRequest.getUsername());
            if (user == null) {
                result.put("success", false);
                result.put("message", "用户名或密码错误");
                return result;
            }

            // 检查用户状态
            if (!user.isEnabled()) {
                result.put("success", false);
                result.put("message", "用户已被禁用");
                return result;
            }

            // 验证密码
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                result.put("success", false);
                result.put("message", "用户名或密码错误");
                return result;
            }

            // 生成JWT Token
            String token = jwtUtil.generateToken(user.getUsername(), user.getId(), user.getRealName());

            // 获取用户权限
            List<String> userPermissions = userService.getUserPermissions(user.getId());
            System.out.println("用户 " + user.getUsername() + " 的权限: " + userPermissions);

            // 返回成功结果
            result.put("success", true);
            result.put("message", "登录成功");
            result.put("token", token);
            
            // 创建用户信息Map（Java 8兼容写法）
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("realName", user.getRealName());
            userInfo.put("department", user.getDepartment());
            userInfo.put("position", user.getPosition());
            userInfo.put("permissions", userPermissions);
            result.put("user", userInfo);

            return result;

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "登录失败: " + e.getMessage());
            return result;
        }
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "注册普通系统用户")
    public Map<String, Object> register(@RequestBody Map<String, Object> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            String username = getString(request, "username");
            String password = getString(request, "password");
            String confirmPassword = getString(request, "confirmPassword");
            String email = getString(request, "email");
            String phone = getString(request, "phone");

            if (username == null || username.trim().isEmpty()) {
                result.put("success", false);
                result.put("message", "用户名不能为空");
                return result;
            }
            if (password == null || password.trim().isEmpty()) {
                result.put("success", false);
                result.put("message", "密码不能为空");
                return result;
            }
            if (confirmPassword != null && !password.equals(confirmPassword)) {
                result.put("success", false);
                result.put("message", "两次输入的密码不一致");
                return result;
            }
            if (userService.getUserByUsername(username) != null) {
                result.put("success", false);
                result.put("message", "用户名已存在");
                return result;
            }

            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setRealName(username);
            user.setEmail(email);
            user.setPhone(phone);
            user.setStatus(1);
            userService.createUser(user);

            result.put("success", true);
            result.put("message", "注册成功，请使用用户名和密码登录");
            return result;
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "注册失败: " + e.getMessage());
            return result;
        }
    }

    @PostMapping("/send-captcha")
    @Operation(summary = "发送验证码", description = "发送注册或找回密码验证码")
    public Map<String, Object> sendCaptcha(@RequestBody Map<String, Object> request) {
        Map<String, Object> result = new HashMap<>();
        String phone = getString(request, "phone");
        if (phone == null || phone.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "手机号不能为空");
            return result;
        }
        result.put("success", true);
        result.put("message", "验证码已发送");
        return result;
    }

    @PostMapping("/reset-password")
    @Operation(summary = "重置密码", description = "将指定用户密码重置为初始密码")
    public Map<String, Object> resetPassword(@RequestBody Map<String, Object> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            String username = getString(request, "username");
            String newPassword = getString(request, "newPassword");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                newPassword = "123456";
            }

            User user = userService.getUserByUsername(username);
            if (user == null) {
                result.put("success", false);
                result.put("message", "用户不存在");
                return result;
            }

            boolean updated = userService.resetPassword(user.getId(), newPassword);
            result.put("success", updated);
            result.put("message", updated ? "密码已重置为 " + newPassword : "密码重置失败");
            return result;
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "密码重置失败: " + e.getMessage());
            return result;
        }
    }

    @GetMapping("/generate-hash")
    @Operation(summary = "生成密码哈希", description = "临时测试端点，生成密码的BCrypt哈希")
    public Map<String, Object> generateHash(@RequestParam String password) {
        Map<String, Object> result = new HashMap<>();
        
        String hash = passwordEncoder.encode(password);
        result.put("password", password);
        result.put("hash", hash);
        result.put("verification", passwordEncoder.matches(password, hash));
        
        return result;
    }

    @GetMapping("/test-permission")
    @Operation(summary = "测试权限", description = "测试用户权限的临时端点")
    public Map<String, Object> testPermission(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                result.put("success", false);
                result.put("message", "Token格式错误");
                return result;
            }

            String token = authHeader.substring(7);
            
            if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                Long userId = jwtUtil.getUserIdFromToken(token);
                
                // 获取用户角色信息
                List<Role> roles = userService.getUserRoles(userId);
                
                result.put("success", true);
                result.put("username", username);
                result.put("userId", userId);
                result.put("roles", roles);
                result.put("message", "用户信息获取成功");
            } else {
                result.put("success", false);
                result.put("message", "Token无效或已过期");
            }

            return result;

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "用户信息获取失败: " + e.getMessage());
            return result;
        }
    }

    @PostMapping("/validate")
    @Operation(summary = "验证Token", description = "验证JWT Token是否有效")
    public Map<String, Object> validateToken(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                result.put("success", false);
                result.put("message", "Token格式错误");
                return result;
            }

            String token = authHeader.substring(7);
            
            if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                Long userId = jwtUtil.getUserIdFromToken(token);
                String realName = jwtUtil.getRealNameFromToken(token);

                // 获取用户权限
                List<String> userPermissions = userService.getUserPermissions(userId);
                System.out.println("Token验证 - 用户ID " + userId + " 的权限: " + userPermissions);

                result.put("success", true);
                result.put("message", "Token有效");
                
                // 创建用户信息Map（Java 8兼容写法）
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", userId);
                userInfo.put("username", username);
                userInfo.put("realName", realName);
                userInfo.put("permissions", userPermissions);
                result.put("user", userInfo);
            } else {
                result.put("success", false);
                result.put("message", "Token无效或已过期");
            }

            return result;

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Token验证失败: " + e.getMessage());
            return result;
        }
    }

    private String getString(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value == null ? null : String.valueOf(value);
    }
}
