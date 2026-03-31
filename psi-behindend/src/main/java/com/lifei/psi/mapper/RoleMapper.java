package com.lifei.psi.mapper;
import com.lifei.psi.entity.Permission;

import com.lifei.psi.entity.Role;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RoleMapper {

    // 查询所有角色
    @Select("SELECT r.*, " +
            "(SELECT COUNT(*) FROM user_roles ur WHERE ur.role_id = r.id) as user_count " +
            "FROM sys_role r ORDER BY r.id")
    List<Role> findAll();

    // 根据ID查询角色
    @Select("SELECT * FROM sys_role WHERE id = #{id}")
    Role findById(Long id);

    // 根据角色编码查询角色
    @Select("SELECT * FROM sys_role WHERE role_code = #{roleCode}")
    Role findByRoleCode(String roleCode);

    // 根据名称查询角色（模糊查询角色名称）
    @Select("SELECT * FROM sys_role WHERE role_name LIKE CONCAT('%', #{name}, '%')")
    List<Role> findByName(String name);

    // 插入角色
    @Insert("INSERT INTO sys_role(role_code, role_name, description, status, level, department, created_time) " +
            "VALUES(#{roleCode}, #{roleName}, #{description}, #{status}, #{level}, #{department}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Role role);

    // 更新角色
    @Update("UPDATE sys_role SET role_code=#{roleCode}, role_name=#{roleName}, " +
            "description=#{description}, status=#{status}, level=#{level}, department=#{department}, " +
            "updated_time=NOW() WHERE id=#{id}")
    int update(Role role);

    // 删除角色
    @Delete("DELETE FROM sys_role WHERE id = #{id}")
    int deleteById(Long id);

        // ================================
    // 角色权限管理方法
    // ================================

    /**
     * 查询角色的所有权限
     */
    @Select("SELECT p.* FROM permissions p " +
            "JOIN role_permissions rp ON p.id = rp.permission_id " +
            "WHERE rp.role_id = #{roleId} AND p.status = 1 " +
            "ORDER BY p.sort_order, p.id")
    List<Permission> findRolePermissions(Long roleId);

    /**
     * 为角色分配权限
     */
    @Insert("INSERT INTO role_permissions(role_id, permission_id) VALUES(#{roleId}, #{permissionId})")
    int assignPermission(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);

    /**
     * 移除角色权限
     */
    @Delete("DELETE FROM role_permissions WHERE role_id = #{roleId} AND permission_id = #{permissionId}")
    int removePermission(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);

    /**
     * 清空角色的所有权限
     */
    @Delete("DELETE FROM role_permissions WHERE role_id = #{roleId}")
    int clearRolePermissions(Long roleId);

    /**
     * 批量为角色分配权限
     */
    @Insert("<script>" +
            "INSERT INTO role_permissions(role_id, permission_id) VALUES " +
            "<foreach collection='permissionIds' item='permissionId' separator=','>" +
            "(#{roleId}, #{permissionId})" +
            "</foreach>" +
            "</script>")
    int batchAssignPermissions(@Param("roleId") Long roleId, @Param("permissionIds") List<Long> permissionIds);

    /**
     * 检查角色是否拥有指定权限
     */
    @Select("SELECT COUNT(*) > 0 FROM role_permissions rp " +
            "JOIN permissions p ON rp.permission_id = p.id " +
            "WHERE rp.role_id = #{roleId} AND p.permission_code = #{permissionCode} AND p.status = 1")
    boolean hasPermission(@Param("roleId") Long roleId, @Param("permissionCode") String permissionCode);

    /**
     * 统计角色的权限数量
     */
    @Select("SELECT COUNT(*) FROM role_permissions rp " +
            "JOIN permissions p ON rp.permission_id = p.id " +
            "WHERE rp.role_id = #{roleId} AND p.status = 1")
    int countRolePermissions(Long roleId);

    /**
     * 查询拥有指定权限的所有角色
     */
    @Select("SELECT r.* FROM sys_role r " +
            "JOIN role_permissions rp ON r.id = rp.role_id " +
            "JOIN permissions p ON rp.permission_id = p.id " +
            "WHERE p.permission_code = #{permissionCode} AND r.status = 1 AND p.status = 1")
    List<Role> findRolesByPermission(String permissionCode);

    /**
     * 查询角色权限编码列表（用于快速权限检查）
     */
    @Select("SELECT p.permission_code FROM permissions p " +
            "JOIN role_permissions rp ON p.id = rp.permission_id " +
            "WHERE rp.role_id = #{roleId} AND p.status = 1")
    List<String> findRolePermissionCodes(Long roleId);

    // ================================
    // 角色权限统计方法
    // ================================

    /**
     * 统计每个角色的权限数量
     */
    @Select("SELECT r.*, " +
            "(SELECT COUNT(*) FROM role_permissions rp " +
            " JOIN permissions p ON rp.permission_id = p.id " +
            " WHERE rp.role_id = r.id AND p.status = 1) as permission_count " +
            "FROM sys_role r ORDER BY r.id")
    List<Role> findAllWithPermissionCount();

    /**
     * 查询没有任何权限的角色
     */
    @Select("SELECT r.* FROM sys_role r " +
            "WHERE r.id NOT IN (SELECT DISTINCT role_id FROM role_permissions) " +
            "AND r.status = 1")
    List<Role> findRolesWithoutPermissions();

}