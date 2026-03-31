package com.lifei.psi.entity;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;

public class User {
    private Long id;
    private String username;
    private String password;
    private String realName;
    private String email;
    private String phone;
    private String department;
    private String position;
    private Integer status; // 1启用 0禁用
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private List<Role> roles;

    // 构造函数
    public User() {
    this.roles = new ArrayList<>();
}

    public User(String username, String password, String realName, String email) {
        this.username = username;
        this.password = password;
        this.realName = realName;
        this.email = email;
        this.roles = new ArrayList<>();
        this.status = 1;
    }

    // Getter和Setter方法
    public List<Role> getRoles() {
    return roles;
}

public void setRoles(List<Role> roles) {
    this.roles = roles;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public LocalDateTime getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(LocalDateTime updatedTime) {
        this.updatedTime = updatedTime;
    }

    // 便捷方法
    public boolean isEnabled() {
        return status != null && status == 1;
    }


    /**
 * 添加角色
 */
public void addRole(Role role) {
    if (this.roles == null) {
        this.roles = new ArrayList<>();
    }
    if (!this.roles.contains(role)) {
        this.roles.add(role);
    }
}

/**
 * 移除角色
 */
public void removeRole(Role role) {
    if (this.roles != null) {
        this.roles.remove(role);
    }
}

/**
 * 检查是否拥有指定角色
 */
public boolean hasRole(String roleCode) {
    if (this.roles == null || roleCode == null) {
        return false;
    }
    return this.roles.stream()
            .anyMatch(r -> roleCode.equals(r.getRoleCode()));
}

/**
 * 检查是否拥有指定权限（通过角色）
 */
public boolean hasPermission(String permissionCode) {
    if (this.roles == null || permissionCode == null) {
        return false;
    }
    return this.roles.stream()
            .anyMatch(role -> role.hasPermission(permissionCode));
}

/**
 * 获取角色数量
 */
public int getRoleCount() {
    return this.roles == null ? 0 : this.roles.size();
}

/**
 * 清空所有角色
 */
public void clearRoles() {
    if (this.roles != null) {
        this.roles.clear();
    }
}

/**
 * 检查是否有角色
 */
public boolean hasAnyRole() {
    return this.roles != null && !this.roles.isEmpty();
}

/**
 * 获取所有权限（从所有角色中）
 */
public List<String> getAllPermissions() {
    List<String> allPermissions = new ArrayList<>();
    if (this.roles != null) {
        for (Role role : this.roles) {
            if (role.getPermissions() != null) {
                for (Permission permission : role.getPermissions()) {
                    if (!allPermissions.contains(permission.getPermissionCode())) {
                        allPermissions.add(permission.getPermissionCode());
                    }
                }
            }
        }
    }
    return allPermissions;
}

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", realName='" + realName + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                ", position='" + position + '\'' +
                ", status=" + status +
                '}';
    }
}