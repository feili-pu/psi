package com.lifei.psi.mapper;

import com.lifei.psi.entity.User;
import com.lifei.psi.entity.Role;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    // 查询所有用户
    @Select("SELECT * FROM users")
    List<User> findAll();

    // 根据ID查询用户
    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(Long id);

    // 根据用户名查询用户
    @Select("SELECT * FROM users WHERE username = #{username}")
    User findByUsername(String username);

    // 根据名称查询用户（模糊查询真实姓名）
    @Select("SELECT * FROM users WHERE real_name LIKE CONCAT('%', #{name}, '%')")
    List<User> findByName(String name);

    // 插入用户
    @Insert("INSERT INTO users(username, password, real_name, email, phone, department, position, status) " +
            "VALUES(#{username}, #{password}, #{realName}, #{email}, #{phone}, #{department}, #{position}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    // 更新用户
    @Update("UPDATE users SET username=#{username}, real_name=#{realName}, email=#{email}, " +
            "phone=#{phone}, department=#{department}, position=#{position}, status=#{status} WHERE id=#{id}")
    int update(User user);

    // 删除用户
    @Delete("DELETE FROM users WHERE id = #{id}")
    int deleteById(Long id);

    // ================================
    // 角色相关查询方法
    // ================================

    // 查询用户的所有角色
    @Select("SELECT r.* FROM sys_role r " +
            "JOIN user_roles ur ON r.id = ur.role_id " +
            "WHERE ur.user_id = #{userId} AND r.status = 1")
    List<Role> findUserRoles(Long userId);

    // 为用户分配角色
    @Insert("INSERT INTO user_roles(user_id, role_id) VALUES(#{userId}, #{roleId})")
    int insertUserRole(@Param("userId") Long userId, @Param("roleId") Long roleId);

    // 移除用户角色
    @Delete("DELETE FROM user_roles WHERE user_id = #{userId} AND role_id = #{roleId}")
    int deleteUserRole(@Param("userId") Long userId, @Param("roleId") Long roleId);

    // 获取用户的所有权限编码
@Select("SELECT DISTINCT p.permission_code FROM permissions p " +
        "JOIN role_permissions rp ON p.id = rp.permission_id " +
        "JOIN user_roles ur ON rp.role_id = ur.role_id " +
        "WHERE ur.user_id = #{userId}")
List<String> findUserPermissions(Long userId);

// 清空用户的所有角色
@Delete("DELETE FROM user_roles WHERE user_id = #{userId}")
int clearUserRoles(Long userId);

// 批量为用户分配角色
@Insert("<script>" +
        "INSERT INTO user_roles(user_id, role_id) VALUES " +
        "<foreach collection='roleIds' item='roleId' separator=','>" +
        "(#{userId}, #{roleId})" +
        "</foreach>" +
        "</script>")
int batchAssignRoles(@Param("userId") Long userId, @Param("roleIds") List<Long> roleIds);

// 检查用户是否拥有指定权限
@Select("SELECT COUNT(*) > 0 FROM permissions p " +
        "JOIN role_permissions rp ON p.id = rp.permission_id " +
        "JOIN user_roles ur ON rp.role_id = ur.role_id " +
        "WHERE ur.user_id = #{userId} AND p.permission_code = #{permissionCode}")
boolean hasPermission(@Param("userId") Long userId, @Param("permissionCode") String permissionCode);

// 检查用户是否拥有指定角色
@Select("SELECT COUNT(*) > 0 FROM sys_role r " +
        "JOIN user_roles ur ON r.id = ur.role_id " +
        "WHERE ur.user_id = #{userId} AND r.role_code = #{roleCode}")
boolean hasRole(@Param("userId") Long userId, @Param("roleCode") String roleCode);

}