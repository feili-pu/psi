package com.lifei.psi.controller;
import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.entity.Role;
import java.util.HashMap;
import java.util.Map;
import com.lifei.psi.entity.User;
import com.lifei.psi.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "用户管理", description = "系统用户的管理")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "获取所有用户", description = "获取系统中所有用户的列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = User.class)))
    })
    @RequirePermission("user:read")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取用户", description = "根据用户ID获取用户详细信息")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "用户不存在")
    })
    @RequirePermission("user:read")
    public User getUserById(
            @Parameter(description = "用户ID", required = true) @PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/search")
    @Operation(summary = "根据名称搜索用户", description = "根据用户名称进行模糊搜索")
    public List<User> searchUsers(
            @Parameter(description = "用户名称", required = true) @RequestParam String name) {
        return userService.getUsersByName(name);
    }

    @PostMapping
    @Operation(summary = "创建新用户", description = "创建一个新的系统用户")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "创建成功"),
            @ApiResponse(responseCode = "400", description = "数据验证失败")
    })
    @RequirePermission("user:create")
    public User createUser(
            @Parameter(description = "用户信息", required = true) @RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新用户", description = "更新现有用户的信息")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "更新成功"),
            @ApiResponse(responseCode = "404", description = "用户不存在")
    })
    @RequirePermission("user:update")
    public User updateUser(
            @Parameter(description = "用户ID", required = true) @PathVariable Long id, 
            @Parameter(description = "用户信息", required = true) @RequestBody User user) {
        user.setId(id);
        return userService.updateUser(user);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户", description = "删除指定的系统用户")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "删除成功"),
            @ApiResponse(responseCode = "404", description = "用户不存在")
    })
    @RequirePermission("user:delete")
    public String deleteUser(
            @Parameter(description = "用户ID", required = true) @PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? "用户删除成功" : "用户删除失败";
    }

        // ================================
    // 用户角色管理相关接口
    // ================================

    @GetMapping("/{id}/roles")
    @Operation(summary = "获取用户角色", description = "获取指定用户的所有角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "用户不存在")
    })
    public List<Role> getUserRoles(
            @Parameter(description = "用户ID", required = true) @PathVariable Long id) {
        return userService.getUserRoles(id);
    }

    @PostMapping("/{userId}/roles/{roleId}")
    @Operation(summary = "为用户分配角色", description = "为指定用户分配一个角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "分配成功"),
            @ApiResponse(responseCode = "404", description = "用户或角色不存在")
    })
    @RequirePermission("user:assign_role")
    public String assignRoleToUser(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId,
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId) {
        boolean success = userService.assignRole(userId, roleId);
        return success ? "角色分配成功" : "角色分配失败";
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    @Operation(summary = "移除用户角色", description = "移除用户的指定角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "移除成功"),
            @ApiResponse(responseCode = "404", description = "用户或角色不存在")
    })
    @RequirePermission("user:remove_role")
    public String removeRoleFromUser(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId,
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId) {
        boolean success = userService.removeRole(userId, roleId);
        return success ? "角色移除成功" : "角色移除失败";
    }

    @PostMapping("/{userId}/roles/batch")
    @Operation(summary = "批量分配用户角色", description = "为用户批量分配角色（会先清空现有角色）")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "分配成功"),
            @ApiResponse(responseCode = "404", description = "用户不存在")
    })
    public String batchAssignRoles(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId,
            @Parameter(description = "角色ID列表", required = true) @RequestBody List<Long> roleIds) {
        boolean success = userService.batchAssignRoles(userId, roleIds);
        return success ? "批量角色分配成功" : "批量角色分配失败";
    }

    @DeleteMapping("/{userId}/roles")
    @Operation(summary = "清空用户角色", description = "清空用户的所有角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "清空成功"),
            @ApiResponse(responseCode = "404", description = "用户不存在")
    })
    public String clearUserRoles(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId) {
        boolean success = userService.clearUserRoles(userId);
        return success ? "用户角色清空成功" : "用户角色清空失败";
    }

    // ================================
    // 用户权限查询相关接口
    // ================================

    @GetMapping("/{id}/permissions")
    @Operation(summary = "获取用户权限编码", description = "获取指定用户的所有权限编码")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "用户不存在")
    })
    public List<String> getUserPermissions(
            @Parameter(description = "用户ID", required = true) @PathVariable Long id) {
        return userService.getUserPermissions(id);
    }

    @GetMapping("/{userId}/permissions/check/{permissionCode}")
    @Operation(summary = "检查用户权限", description = "检查用户是否拥有指定权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "检查完成")
    })
    public Map<String, Object> checkUserPermission(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId,
            @Parameter(description = "权限编码", required = true) @PathVariable String permissionCode) {
        boolean hasPermission = userService.hasPermission(userId, permissionCode);
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("permissionCode", permissionCode);
        result.put("hasPermission", hasPermission);
        return result;
    }

    @GetMapping("/{userId}/roles/check/{roleCode}")
    @Operation(summary = "检查用户角色", description = "检查用户是否拥有指定角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "检查完成")
    })
    public Map<String, Object> checkUserRole(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId,
            @Parameter(description = "角色编码", required = true) @PathVariable String roleCode) {
        boolean hasRole = userService.hasRole(userId, roleCode);
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("roleCode", roleCode);
        result.put("hasRole", hasRole);
        return result;
    }

}