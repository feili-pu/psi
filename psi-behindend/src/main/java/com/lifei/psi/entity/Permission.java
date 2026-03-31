package com.lifei.psi.entity;

import java.time.LocalDateTime;

/**
 * 权限实体类
 */
public class Permission {
    
    private Long id;                    // 权限ID
    private String permissionCode;      // 权限编码
    private String permissionName;      // 权限名称
    private String resourceType;        // 资源类型：API, MENU, BUTTON
    private String resourceUrl;         // 资源路径
    private String httpMethod;          // HTTP方法：GET, POST, PUT, DELETE
    private String description;         // 权限描述
    private Long parentId;              // 父权限ID
    private Integer sortOrder;          // 排序
    private Integer status;             // 状态：1启用，0禁用
    private LocalDateTime createdTime;  // 创建时间
    private LocalDateTime updatedTime;  // 更新时间

    // 构造方法
    public Permission() {}

    public Permission(String permissionCode, String permissionName) {
        this.permissionCode = permissionCode;
        this.permissionName = permissionName;
        this.status = 1; // 默认启用
    }

    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPermissionCode() {
        return permissionCode;
    }

    public void setPermissionCode(String permissionCode) {
        this.permissionCode = permissionCode;
    }

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceUrl() {
        return resourceUrl;
    }

    public void setResourceUrl(String resourceUrl) {
        this.resourceUrl = resourceUrl;
    }

    public String getHttpMethod() {
        return httpMethod;
    }

    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
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

    // 便利方法
    public boolean isEnabled() {
        return status != null && status == 1;
    }

    public void enable() {
        this.status = 1;
    }

    public void disable() {
        this.status = 0;
    }

    @Override
    public String toString() {
        return "Permission{" +
                "id=" + id +
                ", permissionCode='" + permissionCode + '\'' +
                ", permissionName='" + permissionName + '\'' +
                ", resourceType='" + resourceType + '\'' +
                ", resourceUrl='" + resourceUrl + '\'' +
                ", status=" + status +
                '}';
    }
}
