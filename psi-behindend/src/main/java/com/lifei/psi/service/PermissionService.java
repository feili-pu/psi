package com.lifei.psi.service;

import com.lifei.psi.entity.Permission;
import com.lifei.psi.mapper.PermissionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 权限业务逻辑服务
 */
@Service
@Transactional
public class PermissionService {

    @Autowired
    private PermissionMapper permissionMapper;

    // ================================
    // 基础CRUD操作
    // ================================

    /**
     * 获取所有权限
     */
    public List<Permission> getAllPermissions() {
        return permissionMapper.findAll();
    }

    /**
     * 根据ID获取权限
     */
    public Permission getPermissionById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("权限ID不能为空");
        }
        return permissionMapper.findById(id);
    }

    /**
     * 根据权限编码获取权限
     */
    public Permission getPermissionByCode(String permissionCode) {
        if (permissionCode == null || permissionCode.trim().isEmpty()) {
            throw new IllegalArgumentException("权限编码不能为空");
        }
        return permissionMapper.findByPermissionCode(permissionCode);
    }

    /**
     * 根据权限名称搜索权限
     */
    public List<Permission> searchPermissionsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllPermissions();
        }
        return permissionMapper.findByName(name.trim());
    }

    /**
     * 根据资源类型获取权限
     */
    public List<Permission> getPermissionsByResourceType(String resourceType) {
        if (resourceType == null || resourceType.trim().isEmpty()) {
            throw new IllegalArgumentException("资源类型不能为空");
        }
        return permissionMapper.findByResourceType(resourceType);
    }

    /**
     * 获取启用的权限
     */
    public List<Permission> getEnabledPermissions() {
        return permissionMapper.findByStatus(1);
    }

    /**
     * 创建权限
     */
    public Permission createPermission(Permission permission) {
        // 参数验证
        validatePermission(permission);
        
        // 检查权限编码是否已存在
        if (permissionMapper.existsByPermissionCode(permission.getPermissionCode())) {
            throw new IllegalArgumentException("权限编码已存在: " + permission.getPermissionCode());
        }

        // 设置默认值
        if (permission.getStatus() == null) {
            permission.setStatus(1); // 默认启用
        }
        if (permission.getSortOrder() == null) {
            permission.setSortOrder(0);
        }
        if (permission.getResourceType() == null) {
            permission.setResourceType("API");
        }

        permissionMapper.insert(permission);
        return permission;
    }

    /**
     * 更新权限
     */
    public Permission updatePermission(Permission permission) {
        if (permission.getId() == null) {
            throw new IllegalArgumentException("权限ID不能为空");
        }

        // 检查权限是否存在
        Permission existingPermission = permissionMapper.findById(permission.getId());
        if (existingPermission == null) {
            throw new IllegalArgumentException("权限不存在，ID: " + permission.getId());
        }

        // 如果修改了权限编码，检查新编码是否已存在
        if (!existingPermission.getPermissionCode().equals(permission.getPermissionCode())) {
            if (permissionMapper.existsByPermissionCode(permission.getPermissionCode())) {
                throw new IllegalArgumentException("权限编码已存在: " + permission.getPermissionCode());
            }
        }

        validatePermission(permission);
        permissionMapper.update(permission);
        return permission;
    }

    /**
     * 删除权限
     */
    public boolean deletePermission(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("权限ID不能为空");
        }

        Permission permission = permissionMapper.findById(id);
        if (permission == null) {
            throw new IllegalArgumentException("权限不存在，ID: " + id);
        }

        return permissionMapper.deleteById(id) > 0;
    }

    // ================================
    // 权限树形结构操作
    // ================================

    /**
     * 获取根权限列表
     */
    public List<Permission> getRootPermissions() {
        return permissionMapper.findRootPermissions();
    }

    /**
     * 获取子权限列表
     */
    public List<Permission> getChildPermissions(Long parentId) {
        if (parentId == null) {
            throw new IllegalArgumentException("父权限ID不能为空");
        }
        return permissionMapper.findByParentId(parentId);
    }

    // ================================
    // 用户权限查询
    // ================================

    /**
     * 获取用户的所有权限
     */
    public List<Permission> getUserPermissions(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("用户ID不能为空");
        }
        return permissionMapper.findByUserId(userId);
    }

    /**
     * 获取用户的权限编码列表
     */
    public List<String> getUserPermissionCodes(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("用户ID不能为空");
        }
        return permissionMapper.findPermissionCodesByUserId(userId);
    }

    /**
     * 检查用户是否拥有指定权限
     */
    public boolean hasPermission(Long userId, String permissionCode) {
        if (userId == null || permissionCode == null || permissionCode.trim().isEmpty()) {
            return false;
        }
        return permissionMapper.hasPermission(userId, permissionCode);
    }

    // ================================
    // 角色权限查询
    // ================================

    /**
     * 获取角色的所有权限
     */
    public List<Permission> getRolePermissions(Long roleId) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        return permissionMapper.findByRoleId(roleId);
    }

    // ================================
    // 统计操作
    // ================================

    /**
     * 统计启用的权限数量
     */
    public int countEnabledPermissions() {
        return permissionMapper.countEnabled();
    }

    /**
     * 按资源类型统计权限数量
     */
    public int countPermissionsByResourceType(String resourceType) {
        if (resourceType == null || resourceType.trim().isEmpty()) {
            throw new IllegalArgumentException("资源类型不能为空");
        }
        return permissionMapper.countByResourceType(resourceType);
    }

    // ================================
    // 批量操作
    // ================================

    /**
     * 批量启用权限
     */
    public boolean batchEnablePermissions(List<Long> permissionIds) {
        if (permissionIds == null || permissionIds.isEmpty()) {
            throw new IllegalArgumentException("权限ID列表不能为空");
        }
        
        String ids = String.join(",", permissionIds.stream().map(String::valueOf).toArray(String[]::new));
        return permissionMapper.batchEnable(ids) > 0;
    }

    /**
     * 批量禁用权限
     */
    public boolean batchDisablePermissions(List<Long> permissionIds) {
        if (permissionIds == null || permissionIds.isEmpty()) {
            throw new IllegalArgumentException("权限ID列表不能为空");
        }
        
        String ids = String.join(",", permissionIds.stream().map(String::valueOf).toArray(String[]::new));
        return permissionMapper.batchDisable(ids) > 0;
    }

    // ================================
    // 私有辅助方法
    // ================================

    /**
     * 验证权限对象
     */
    private void validatePermission(Permission permission) {
        if (permission == null) {
            throw new IllegalArgumentException("权限对象不能为空");
        }
        if (permission.getPermissionCode() == null || permission.getPermissionCode().trim().isEmpty()) {
            throw new IllegalArgumentException("权限编码不能为空");
        }
        if (permission.getPermissionName() == null || permission.getPermissionName().trim().isEmpty()) {
            throw new IllegalArgumentException("权限名称不能为空");
        }
        
        // 权限编码格式验证（可选）
        String code = permission.getPermissionCode().trim();
        if (!code.matches("^[a-zA-Z][a-zA-Z0-9:_-]*$")) {
            throw new IllegalArgumentException("权限编码格式不正确，应以字母开头，只能包含字母、数字、冒号、下划线和连字符");
        }
    }
}
