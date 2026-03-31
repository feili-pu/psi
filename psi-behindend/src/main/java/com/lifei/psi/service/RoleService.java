package com.lifei.psi.service;
import com.lifei.psi.entity.Permission;
import java.util.List;
import com.lifei.psi.entity.Role;
import com.lifei.psi.mapper.RoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lifei.psi.mapper.PermissionMapper;

@Service
public class RoleService {

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
private PermissionMapper permissionMapper;


    public List<Role> getAllRoles() {
        return roleMapper.findAll();
    }

    public Role getRoleById(Long id) {
        return roleMapper.findById(id);
    }

    public Role getRoleByCode(String roleCode) {
        return roleMapper.findByRoleCode(roleCode);
    }

    public List<Role> getRolesByName(String name) {
        return roleMapper.findByName(name);
    }

    public Role createRole(Role role) {
        roleMapper.insert(role);
        return role; // ID会自动填充
    }

    public Role updateRole(Role role) {
        roleMapper.update(role);
        return role;
    }

    public boolean deleteRole(Long id) {
        return roleMapper.deleteById(id) > 0;
    }

        // ================================
    // 角色权限管理方法
    // ================================

    /**
     * 获取角色的所有权限
     */
    public List<Permission> getRolePermissions(Long roleId) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        
        Role role = roleMapper.findById(roleId);
        if (role == null) {
            throw new IllegalArgumentException("角色不存在，ID: " + roleId);
        }
        
        return roleMapper.findRolePermissions(roleId);
    }

    /**
     * 为角色分配权限
     */
    public boolean assignPermissionToRole(Long roleId, Long permissionId) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        if (permissionId == null) {
            throw new IllegalArgumentException("权限ID不能为空");
        }

        // 检查角色是否存在
        Role role = roleMapper.findById(roleId);
        if (role == null) {
            throw new IllegalArgumentException("角色不存在，ID: " + roleId);
        }

        // 检查权限是否存在
        Permission permission = permissionMapper.findById(permissionId);
        if (permission == null) {
            throw new IllegalArgumentException("权限不存在，ID: " + permissionId);
        }

        // 检查是否已经分配过该权限
        if (roleMapper.hasPermission(roleId, permission.getPermissionCode())) {
            return true; // 已经有该权限，返回成功
        }

        return roleMapper.assignPermission(roleId, permissionId) > 0;
    }

    /**
     * 移除角色权限
     */
    public boolean removePermissionFromRole(Long roleId, Long permissionId) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        if (permissionId == null) {
            throw new IllegalArgumentException("权限ID不能为空");
        }

        return roleMapper.removePermission(roleId, permissionId) > 0;
    }

    /**
     * 清空角色的所有权限
     */
    public boolean clearRolePermissions(Long roleId) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }

        Role role = roleMapper.findById(roleId);
        if (role == null) {
            throw new IllegalArgumentException("角色不存在，ID: " + roleId);
        }

        return roleMapper.clearRolePermissions(roleId) >= 0; // >= 0 因为可能没有权限需要清空
    }

    /**
     * 批量为角色分配权限
     */
    public boolean batchAssignPermissions(Long roleId, List<Long> permissionIds) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        if (permissionIds == null || permissionIds.isEmpty()) {
            throw new IllegalArgumentException("权限ID列表不能为空");
        }

        // 检查角色是否存在
        Role role = roleMapper.findById(roleId);
        if (role == null) {
            throw new IllegalArgumentException("角色不存在，ID: " + roleId);
        }

        // 先清空现有权限，再批量分配新权限
        roleMapper.clearRolePermissions(roleId);
        return roleMapper.batchAssignPermissions(roleId, permissionIds) > 0;
    }

    /**
     * 检查角色是否拥有指定权限
     */
    public boolean hasPermission(Long roleId, String permissionCode) {
        if (roleId == null || permissionCode == null || permissionCode.trim().isEmpty()) {
            return false;
        }
        return roleMapper.hasPermission(roleId, permissionCode);
    }

    /**
     * 获取角色权限编码列表
     */
    public List<String> getRolePermissionCodes(Long roleId) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        return roleMapper.findRolePermissionCodes(roleId);
    }

    /**
     * 统计角色的权限数量
     */
    public int countRolePermissions(Long roleId) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        return roleMapper.countRolePermissions(roleId);
    }

    /**
     * 查询拥有指定权限的所有角色
     */
    public List<Role> getRolesByPermission(String permissionCode) {
        if (permissionCode == null || permissionCode.trim().isEmpty()) {
            throw new IllegalArgumentException("权限编码不能为空");
        }
        return roleMapper.findRolesByPermission(permissionCode);
    }

    /**
     * 获取所有角色及其权限数量
     */
    public List<Role> getAllRolesWithPermissionCount() {
        return roleMapper.findAllWithPermissionCount();
    }

    /**
     * 查询没有任何权限的角色
     */
    public List<Role> getRolesWithoutPermissions() {
        return roleMapper.findRolesWithoutPermissions();
    }

    // ================================
    // 角色权限便利方法
    // ================================

    /**
     * 为角色分配权限（通过权限编码）
     */
    public boolean assignPermissionByCode(Long roleId, String permissionCode) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        if (permissionCode == null || permissionCode.trim().isEmpty()) {
            throw new IllegalArgumentException("权限编码不能为空");
        }

        Permission permission = permissionMapper.findByPermissionCode(permissionCode);
        if (permission == null) {
            throw new IllegalArgumentException("权限不存在，编码: " + permissionCode);
        }

        return assignPermissionToRole(roleId, permission.getId());
    }

    /**
     * 移除角色权限（通过权限编码）
     */
    public boolean removePermissionByCode(Long roleId, String permissionCode) {
        if (roleId == null) {
            throw new IllegalArgumentException("角色ID不能为空");
        }
        if (permissionCode == null || permissionCode.trim().isEmpty()) {
            throw new IllegalArgumentException("权限编码不能为空");
        }

        Permission permission = permissionMapper.findByPermissionCode(permissionCode);
        if (permission == null) {
            return true; // 权限不存在，认为移除成功
        }

        return removePermissionFromRole(roleId, permission.getId());
    }

}