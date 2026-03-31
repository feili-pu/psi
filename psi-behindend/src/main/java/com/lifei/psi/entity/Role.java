package com.lifei.psi.entity;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class Role {
    private Long id;
    private String roleCode;
    private String roleName;
    private String description;
    private Integer status; // 1启用 0禁用
    private String level; // 角色层级：SUPER, EXECUTIVE, DIRECTOR, MANAGER, SUPERVISOR, SPECIALIST, STAFF
    private String department; // 所属部门
    private Integer userCount; // 用户数量（查询时计算）
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private List<Permission> permissions;  // 角色拥有的权限列表


    // 构造函数
    public Role() {
        this.permissions = new ArrayList<>();
    }

    public Role(String roleCode, String roleName, String description) {
        this.roleCode = roleCode;
        this.roleName = roleName;
        this.description = description;
        this.status = 1;
        this.level = "STAFF";
        this.permissions = new ArrayList<>(); 
    }




// 添加权限相关的Getter/Setter和便利方法
public List<Permission> getPermissions() {
    return permissions;
}

public void setPermissions(List<Permission> permissions) {
    this.permissions = permissions;
}

// 权限操作便利方法
public void addPermission(Permission permission) {
    if (this.permissions == null) {
        this.permissions = new ArrayList<>();
    }
    if (!this.permissions.contains(permission)) {
        this.permissions.add(permission);
    }
}

public boolean hasPermission(String permissionCode) {
    if (this.permissions == null || permissionCode == null) {
        return false;
    }
    return this.permissions.stream()
            .anyMatch(p -> permissionCode.equals(p.getPermissionCode()));
}

/**
 * 移除权限
 */
public void removePermission(Permission permission) {
    if (this.permissions != null) {
        this.permissions.remove(permission);
    }
}

/**
 * 获取权限数量
 */
public int getPermissionCount() {
    return this.permissions == null ? 0 : this.permissions.size();
}

/**
 * 清空所有权限
 */
public void clearPermissions() {
    if (this.permissions != null) {
        this.permissions.clear();
    }
}

/**
 * 检查是否有权限
 */
public boolean hasAnyPermission() {
    return this.permissions != null && !this.permissions.isEmpty();
}

   


    // Getter和Setter方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getUserCount() {
        return userCount;
    }

    public void setUserCount(Integer userCount) {
        this.userCount = userCount;
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

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", roleCode='" + roleCode + '\'' +
                ", roleName='" + roleName + '\'' +
                ", description='" + description + '\'' +
                ", level='" + level + '\'' +
                ", department='" + department + '\'' +
                ", status=" + status +
                '}';
    }
}