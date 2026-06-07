package com.lifei.psi.service;

import com.lifei.psi.entity.User;
import com.lifei.psi.entity.Role;
import com.lifei.psi.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> getAllUsers() {
        List<User> users = userMapper.findAll();
        // 为每个用户加载角色信息
        for (User user : users) {
            List<Role> roles = userMapper.findUserRoles(user.getId());
            user.setRoles(roles);
        }
        return users;
    }

    public User getUserById(Long id) {
        User user = userMapper.findById(id);
        if (user != null) {
            // 加载用户角色信息
            List<Role> roles = userMapper.findUserRoles(user.getId());
            user.setRoles(roles);
        }
        return user;
    }

    public User getUserByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public List<User> getUsersByName(String name) {
        List<User> users = userMapper.findByName(name);
        // 为每个用户加载角色信息
        for (User user : users) {
            List<Role> roles = userMapper.findUserRoles(user.getId());
            user.setRoles(roles);
        }
        return users;
    }

    public User createUser(User user) {
        if (user.getPassword() != null && !user.getPassword().startsWith("$2")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getStatus() == null) {
            user.setStatus(1);
        }
        userMapper.insert(user);
        return user; // ID会自动填充
    }

    public User updateUser(User user) {
        userMapper.update(user);
        return user;
    }

    public boolean deleteUser(Long id) {
        return userMapper.deleteById(id) > 0;
    }

    /**
     * 获取用户的所有角色
     */
    public List<Role> getUserRoles(Long userId) {
        return userMapper.findUserRoles(userId);
    }

    /**
     * 为用户分配角色
     */
    public boolean assignRole(Long userId, Long roleId) {
        return userMapper.insertUserRole(userId, roleId) > 0;
    }

    /**
     * 移除用户角色
     */
    public boolean removeRole(Long userId, Long roleId) {
        return userMapper.deleteUserRole(userId, roleId) > 0;
    }

    /**
 * 检查用户是否拥有指定权限
 */
public boolean hasPermission(Long userId, String permissionCode) {
    if (userId == null || permissionCode == null || permissionCode.trim().isEmpty()) {
        return false;
    }
    
    // 直接使用 UserMapper 的方法，更高效
    return userMapper.hasPermission(userId, permissionCode);
}


/**
 * 获取用户的所有权限编码
 */
public List<String> getUserPermissions(Long userId) {
    return userMapper.findUserPermissions(userId);
}

/**
 * 检查用户是否拥有指定角色
 */
public boolean hasRole(Long userId, String roleCode) {
    if (userId == null || roleCode == null || roleCode.trim().isEmpty()) {
        return false;
    }
    
    // 直接使用 UserMapper 的方法，更高效
    return userMapper.hasRole(userId, roleCode);
}



/**
 * 批量为用户分配角色
 */
public boolean batchAssignRoles(Long userId, List<Long> roleIds) {
    if (userId == null || roleIds == null || roleIds.isEmpty()) {
        return false;
    }
    
    // 先清空用户现有角色
    userMapper.clearUserRoles(userId);
    
    // 使用批量分配方法
    return userMapper.batchAssignRoles(userId, roleIds) > 0;
}


/**
 * 清空用户的所有角色
 */
public boolean clearUserRoles(Long userId) {
    if (userId == null) {
        return false;
    }
    return userMapper.clearUserRoles(userId) >= 0;
}

public boolean resetPassword(Long userId, String rawPassword) {
    if (userId == null || rawPassword == null || rawPassword.trim().isEmpty()) {
        return false;
    }
    return userMapper.updatePassword(userId, passwordEncoder.encode(rawPassword)) > 0;
}

}
