package com.lifei.psi.controller;

import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.entity.Permission;
import com.lifei.psi.service.PermissionService;
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
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/permissions")
@Tag(name = "权限管理", description = "系统权限的管理")
@RequirePermission("permission:manage")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @GetMapping
    @Operation(summary = "获取所有权限", description = "获取系统中所有权限的列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = Permission.class)))
    })
    @RequirePermission("permission:read")
    public List<Permission> getAllPermissions() {
        return permissionService.getAllPermissions();
    }

    @GetMapping("/root")
    @Operation(summary = "获取根权限", description = "获取所有根权限（父权限为空的权限）")
    public List<Permission> getRootPermissions() {
        return permissionService.getRootPermissions();
    }

    @GetMapping("/enabled")
    @Operation(summary = "获取启用的权限", description = "获取所有启用状态的权限")
    public List<Permission> getEnabledPermissions() {
        return permissionService.getEnabledPermissions();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取权限", description = "根据权限ID获取权限详细信息")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "权限不存在")
    })
    public Permission getPermissionById(
            @Parameter(description = "权限ID", required = true) @PathVariable Long id) {
        return permissionService.getPermissionById(id);
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "根据编码获取权限", description = "根据权限编码获取权限详细信息")
    public Permission getPermissionByCode(
            @Parameter(description = "权限编码", required = true) @PathVariable String code) {
        return permissionService.getPermissionByCode(code);
    }

    @GetMapping("/search")
    @Operation(summary = "根据名称搜索权限", description = "根据权限名称进行模糊搜索")
    public List<Permission> searchPermissions(
            @Parameter(description = "权限名称", required = true) @RequestParam String name) {
        return permissionService.searchPermissionsByName(name);
    }

    @GetMapping("/resource-type/{type}")
    @Operation(summary = "根据资源类型获取权限", description = "获取指定资源类型的所有权限")
    public List<Permission> getPermissionsByResourceType(
            @Parameter(description = "资源类型", required = true) @PathVariable String type) {
        return permissionService.getPermissionsByResourceType(type);
    }

    @GetMapping("/parent/{parentId}")
    @Operation(summary = "获取子权限", description = "获取指定父权限下的所有子权限")
    public List<Permission> getChildPermissions(
            @Parameter(description = "父权限ID", required = true) @PathVariable Long parentId) {
        return permissionService.getChildPermissions(parentId);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "获取用户权限", description = "获取指定用户的所有权限")
    public List<Permission> getUserPermissions(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId) {
        return permissionService.getUserPermissions(userId);
    }

    @GetMapping("/user/{userId}/codes")
    @Operation(summary = "获取用户权限编码", description = "获取指定用户的所有权限编码")
    public List<String> getUserPermissionCodes(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId) {
        return permissionService.getUserPermissionCodes(userId);
    }

    @GetMapping("/role/{roleId}")
    @Operation(summary = "获取角色权限", description = "获取指定角色的所有权限")
    public List<Permission> getRolePermissions(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId) {
        return permissionService.getRolePermissions(roleId);
    }

    @PostMapping
    @Operation(summary = "创建新权限", description = "创建一个新的系统权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "创建成功"),
            @ApiResponse(responseCode = "400", description = "数据验证失败")
    })
    @RequirePermission("permission:create")
    public Permission createPermission(
            @Parameter(description = "权限信息", required = true) @RequestBody Permission permission) {
        return permissionService.createPermission(permission);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新权限", description = "更新现有权限的信息")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "更新成功"),
            @ApiResponse(responseCode = "404", description = "权限不存在")
    })
    @RequirePermission("permission:update")
    public Permission updatePermission(
            @Parameter(description = "权限ID", required = true) @PathVariable Long id, 
            @Parameter(description = "权限信息", required = true) @RequestBody Permission permission) {
        permission.setId(id);
        return permissionService.updatePermission(permission);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除权限", description = "删除指定的系统权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "删除成功"),
            @ApiResponse(responseCode = "404", description = "权限不存在")
    })
    @RequirePermission("permission:delete")
    public String deletePermission(
            @Parameter(description = "权限ID", required = true) @PathVariable Long id) {
        boolean deleted = permissionService.deletePermission(id);
        return deleted ? "权限删除成功" : "权限删除失败";
    }

    @GetMapping("/check/{userId}/{permissionCode}")
    @Operation(summary = "检查用户权限", description = "检查用户是否拥有指定权限")
    public Map<String, Object> checkUserPermission(
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId,
            @Parameter(description = "权限编码", required = true) @PathVariable String permissionCode) {
        boolean hasPermission = permissionService.hasPermission(userId, permissionCode);
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("permissionCode", permissionCode);
        result.put("hasPermission", hasPermission);
        return result;
    }

    @GetMapping("/statistics")
    @Operation(summary = "获取权限统计", description = "获取权限的基本统计信息")
    public Map<String, Object> getPermissionStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPermissions", permissionService.getAllPermissions().size());
        stats.put("enabledPermissions", permissionService.countEnabledPermissions());
        stats.put("apiPermissions", permissionService.countPermissionsByResourceType("API"));
        stats.put("menuPermissions", permissionService.countPermissionsByResourceType("MENU"));
        stats.put("buttonPermissions", permissionService.countPermissionsByResourceType("BUTTON"));
        return stats;
    }

    @PostMapping("/batch/enable")
    @Operation(summary = "批量启用权限", description = "批量启用指定的权限")
    public String batchEnablePermissions(
            @Parameter(description = "权限ID列表", required = true) @RequestBody List<Long> permissionIds) {
        boolean success = permissionService.batchEnablePermissions(permissionIds);
        return success ? "批量启用成功" : "批量启用失败";
    }

    @PostMapping("/batch/disable")
    @Operation(summary = "批量禁用权限", description = "批量禁用指定的权限")
    public String batchDisablePermissions(
            @Parameter(description = "权限ID列表", required = true) @RequestBody List<Long> permissionIds) {
        boolean success = permissionService.batchDisablePermissions(permissionIds);
        return success ? "批量禁用成功" : "批量禁用失败";
    }
}
