package com.lifei.psi.mapper;

import com.lifei.psi.entity.Permission;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PermissionMapper {

    // ================================
    // 基础CRUD操作
    // ================================

    /**
     * 查询所有权限
     */
    @Select("SELECT * FROM permissions ORDER BY sort_order, id")
    List<Permission> findAll();

    /**
     * 根据ID查询权限
     */
    @Select("SELECT * FROM permissions WHERE id = #{id}")
    Permission findById(Long id);

    /**
     * 根据权限编码查询权限
     */
    @Select("SELECT * FROM permissions WHERE permission_code = #{permissionCode}")
    Permission findByPermissionCode(String permissionCode);

    /**
     * 根据权限名称模糊查询
     */
    @Select("SELECT * FROM permissions WHERE permission_name LIKE CONCAT('%', #{name}, '%') ORDER BY sort_order")
    List<Permission> findByName(String name);

    /**
     * 根据资源类型查询权限
     */
    @Select("SELECT * FROM permissions WHERE resource_type = #{resourceType} ORDER BY sort_order")
    List<Permission> findByResourceType(String resourceType);

    /**
     * 根据状态查询权限
     */
    @Select("SELECT * FROM permissions WHERE status = #{status} ORDER BY sort_order")
    List<Permission> findByStatus(Integer status);

    /**
     * 插入权限
     */
    @Insert("INSERT INTO permissions(permission_code, permission_name, resource_type, resource_url, " +
            "http_method, description, parent_id, sort_order, status) " +
            "VALUES(#{permissionCode}, #{permissionName}, #{resourceType}, #{resourceUrl}, " +
            "#{httpMethod}, #{description}, #{parentId}, #{sortOrder}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Permission permission);

    /**
     * 更新权限
     */
    @Update("UPDATE permissions SET permission_code=#{permissionCode}, permission_name=#{permissionName}, " +
            "resource_type=#{resourceType}, resource_url=#{resourceUrl}, http_method=#{httpMethod}, " +
            "description=#{description}, parent_id=#{parentId}, sort_order=#{sortOrder}, " +
            "status=#{status}, updated_time=NOW() WHERE id=#{id}")
    int update(Permission permission);

    /**
     * 删除权限
     */
    @Delete("DELETE FROM permissions WHERE id = #{id}")
    int deleteById(Long id);

    // ================================
    // 角色权限关联查询
    // ================================

    /**
     * 根据角色ID查询权限列表
     */
    @Select("SELECT p.* FROM permissions p " +
            "JOIN role_permissions rp ON p.id = rp.permission_id " +
            "WHERE rp.role_id = #{roleId} AND p.status = 1 " +
            "ORDER BY p.sort_order, p.id")
    List<Permission> findByRoleId(Long roleId);

    /**
     * 根据用户ID查询权限列表（通过角色）
     */
    @Select("SELECT DISTINCT p.* FROM permissions p " +
            "JOIN role_permissions rp ON p.id = rp.permission_id " +
            "JOIN sys_role r ON rp.role_id = r.id " +
            "JOIN user_roles ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND p.status = 1 AND r.status = 1 " +
            "ORDER BY p.sort_order, p.id")
    List<Permission> findByUserId(Long userId);

    /**
     * 根据用户ID查询权限编码列表（用于权限检查）
     */
    @Select("SELECT DISTINCT p.permission_code FROM permissions p " +
            "JOIN role_permissions rp ON p.id = rp.permission_id " +
            "JOIN sys_role r ON rp.role_id = r.id " +
            "JOIN user_roles ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND p.status = 1 AND r.status = 1")
    List<String> findPermissionCodesByUserId(Long userId);

    // ================================
    // 权限树形结构查询
    // ================================

    /**
     * 查询根权限（父权限为空的权限）
     */
    @Select("SELECT * FROM permissions WHERE parent_id IS NULL AND status = 1 ORDER BY sort_order")
    List<Permission> findRootPermissions();

    /**
     * 根据父权限ID查询子权限
     */
    @Select("SELECT * FROM permissions WHERE parent_id = #{parentId} AND status = 1 ORDER BY sort_order")
    List<Permission> findByParentId(Long parentId);

    // ================================
    // 统计查询
    // ================================

    /**
     * 统计权限总数
     */
    @Select("SELECT COUNT(*) FROM permissions WHERE status = 1")
    int countEnabled();

    /**
     * 统计指定资源类型的权限数量
     */
    @Select("SELECT COUNT(*) FROM permissions WHERE resource_type = #{resourceType} AND status = 1")
    int countByResourceType(String resourceType);

    // ================================
    // 批量操作
    // ================================

    /**
     * 批量启用权限
     */
    @Update("UPDATE permissions SET status = 1, updated_time = NOW() WHERE id IN (${ids})")
    int batchEnable(@Param("ids") String ids);

    /**
     * 批量禁用权限
     */
    @Update("UPDATE permissions SET status = 0, updated_time = NOW() WHERE id IN (${ids})")
    int batchDisable(@Param("ids") String ids);

    // ================================
    // 权限验证
    // ================================

    /**
     * 检查用户是否拥有指定权限
     */
    @Select("SELECT COUNT(*) > 0 FROM permissions p " +
            "JOIN role_permissions rp ON p.id = rp.permission_id " +
            "JOIN sys_role r ON rp.role_id = r.id " +
            "JOIN user_roles ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND p.permission_code = #{permissionCode} " +
            "AND p.status = 1 AND r.status = 1")
    boolean hasPermission(@Param("userId") Long userId, @Param("permissionCode") String permissionCode);

    /**
     * 检查权限编码是否已存在
     */
    @Select("SELECT COUNT(*) > 0 FROM permissions WHERE permission_code = #{permissionCode}")
    boolean existsByPermissionCode(String permissionCode);
}
