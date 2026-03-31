package com.lifei.psi.controller;
import com.lifei.psi.annotation.RequirePermission;
import com.lifei.psi.entity.Permission;
import java.util.HashMap;
import java.util.Map;
import com.lifei.psi.entity.Role;
import com.lifei.psi.service.RoleService;
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
@RequestMapping("/api/roles")
@Tag(name = "角色管理", description = "系统角色的管理")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    @Operation(summary = "获取所有角色", description = "获取系统中所有角色的列表")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功", 
                    content = @Content(schema = @Schema(implementation = Role.class)))
    })
    @RequirePermission("role:read")
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取角色", description = "根据角色ID获取角色详细信息")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "角色不存在")
    })
    public Role getRoleById(
            @Parameter(description = "角色ID", required = true) @PathVariable Long id) {
        return roleService.getRoleById(id);
    }

    @GetMapping("/search")
    @Operation(summary = "根据名称搜索角色", description = "根据角色名称进行模糊搜索")
    public List<Role> searchRoles(
            @Parameter(description = "角色名称", required = true) @RequestParam String name) {
        return roleService.getRolesByName(name);
    }

    @PostMapping
    @Operation(summary = "创建新角色", description = "创建一个新的系统角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "创建成功"),
            @ApiResponse(responseCode = "400", description = "数据验证失败")
    })
    @RequirePermission("role:create")
    public Role createRole(
            @Parameter(description = "角色信息", required = true) @RequestBody Role role) {
        return roleService.createRole(role);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新角色", description = "更新现有角色的信息")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "更新成功"),
            @ApiResponse(responseCode = "404", description = "角色不存在")
    })
    @RequirePermission("role:update")
    public Role updateRole(
            @Parameter(description = "角色ID", required = true) @PathVariable Long id, 
            @Parameter(description = "角色信息", required = true) @RequestBody Role role) {
        role.setId(id);
        return roleService.updateRole(role);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除角色", description = "删除指定的系统角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "删除成功"),
            @ApiResponse(responseCode = "404", description = "角色不存在")
    })
    @RequirePermission("role:delete")
    public String deleteRole(
            @Parameter(description = "角色ID", required = true) @PathVariable Long id) {
        boolean deleted = roleService.deleteRole(id);
        return deleted ? "角色删除成功" : "角色删除失败";
    }

        // ================================
    // 角色权限管理相关接口
    // ================================

    @GetMapping("/{id}/permissions")
    @Operation(summary = "获取角色权限", description = "获取指定角色的所有权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "角色不存在")
    })
    public List<Permission> getRolePermissions(
            @Parameter(description = "角色ID", required = true) @PathVariable Long id) {
        return roleService.getRolePermissions(id);
    }

    @GetMapping("/{id}/permissions/codes")
    @Operation(summary = "获取角色权限编码", description = "获取指定角色的所有权限编码")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "角色不存在")
    })
    public List<String> getRolePermissionCodes(
            @Parameter(description = "角色ID", required = true) @PathVariable Long id) {
        return roleService.getRolePermissionCodes(id);
    }

    @PostMapping("/{roleId}/permissions/{permissionId}")
    @Operation(summary = "为角色分配权限", description = "为指定角色分配一个权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "分配成功"),
            @ApiResponse(responseCode = "404", description = "角色或权限不存在")
    })
    @RequirePermission("role:assign_permission")
    public String assignPermissionToRole(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId,
            @Parameter(description = "权限ID", required = true) @PathVariable Long permissionId) {
        boolean success = roleService.assignPermissionToRole(roleId, permissionId);
        return success ? "权限分配成功" : "权限分配失败";
    }

    @PostMapping("/{roleId}/permissions/code/{permissionCode}")
    @Operation(summary = "为角色分配权限（通过编码）", description = "通过权限编码为角色分配权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "分配成功"),
            @ApiResponse(responseCode = "404", description = "角色或权限不存在")
    })
    public String assignPermissionByCode(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId,
            @Parameter(description = "权限编码", required = true) @PathVariable String permissionCode) {
        boolean success = roleService.assignPermissionByCode(roleId, permissionCode);
        return success ? "权限分配成功" : "权限分配失败";
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @Operation(summary = "移除角色权限", description = "移除角色的指定权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "移除成功"),
            @ApiResponse(responseCode = "404", description = "角色或权限不存在")
    })
    @RequirePermission("role:remove_permission")
    public String removePermissionFromRole(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId,
            @Parameter(description = "权限ID", required = true) @PathVariable Long permissionId) {
        boolean success = roleService.removePermissionFromRole(roleId, permissionId);
        return success ? "权限移除成功" : "权限移除失败";
    }

    @DeleteMapping("/{roleId}/permissions/code/{permissionCode}")
    @Operation(summary = "移除角色权限（通过编码）", description = "通过权限编码移除角色权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "移除成功"),
            @ApiResponse(responseCode = "404", description = "角色或权限不存在")
    })
    public String removePermissionByCode(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId,
            @Parameter(description = "权限编码", required = true) @PathVariable String permissionCode) {
        boolean success = roleService.removePermissionByCode(roleId, permissionCode);
        return success ? "权限移除成功" : "权限移除失败";
    }

    @PostMapping("/{roleId}/permissions/batch")
    @Operation(summary = "批量分配角色权限", description = "为角色批量分配权限（会先清空现有权限）")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "分配成功"),
            @ApiResponse(responseCode = "404", description = "角色不存在")
    })
    public String batchAssignPermissions(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId,
            @Parameter(description = "权限ID列表", required = true) @RequestBody List<Long> permissionIds) {
        boolean success = roleService.batchAssignPermissions(roleId, permissionIds);
        return success ? "批量权限分配成功" : "批量权限分配失败";
    }

    @DeleteMapping("/{roleId}/permissions")
    @Operation(summary = "清空角色权限", description = "清空角色的所有权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "清空成功"),
            @ApiResponse(responseCode = "404", description = "角色不存在")
    })
    public String clearRolePermissions(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId) {
        boolean success = roleService.clearRolePermissions(roleId);
        return success ? "角色权限清空成功" : "角色权限清空失败";
    }

    // ================================
    // 角色权限查询和统计相关接口
    // ================================

    @GetMapping("/{roleId}/permissions/check/{permissionCode}")
    @Operation(summary = "检查角色权限", description = "检查角色是否拥有指定权限")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "检查完成")
    })
    public Map<String, Object> checkRolePermission(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId,
            @Parameter(description = "权限编码", required = true) @PathVariable String permissionCode) {
        boolean hasPermission = roleService.hasPermission(roleId, permissionCode);
        Map<String, Object> result = new HashMap<>();
        result.put("roleId", roleId);
        result.put("permissionCode", permissionCode);
        result.put("hasPermission", hasPermission);
        return result;
    }

    @GetMapping("/{roleId}/permissions/count")
    @Operation(summary = "统计角色权限数量", description = "统计指定角色拥有的权限数量")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "统计完成")
    })
    public Map<String, Object> countRolePermissions(
            @Parameter(description = "角色ID", required = true) @PathVariable Long roleId) {
        int count = roleService.countRolePermissions(roleId);
        Map<String, Object> result = new HashMap<>();
        result.put("roleId", roleId);
        result.put("permissionCount", count);
        return result;
    }

    @GetMapping("/code/{roleCode}")
    @Operation(summary = "根据编码获取角色", description = "根据角色编码获取角色详细信息")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功"),
            @ApiResponse(responseCode = "404", description = "角色不存在")
    })
    public Role getRoleByCode(
            @Parameter(description = "角色编码", required = true) @PathVariable String roleCode) {
        return roleService.getRoleByCode(roleCode);
    }

    @GetMapping("/permission/{permissionCode}")
    @Operation(summary = "根据权限获取角色", description = "获取拥有指定权限的所有角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功")
    })
    public List<Role> getRolesByPermission(
            @Parameter(description = "权限编码", required = true) @PathVariable String permissionCode) {
        return roleService.getRolesByPermission(permissionCode);
    }

    @GetMapping("/with-permission-count")
    @Operation(summary = "获取角色及权限数量", description = "获取所有角色及其权限数量统计")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功")
    })
    public List<Role> getAllRolesWithPermissionCount() {
        return roleService.getAllRolesWithPermissionCount();
    }

    @GetMapping("/without-permissions")
    @Operation(summary = "获取无权限角色", description = "获取没有分配任何权限的角色")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "获取成功")
    })
    public List<Role> getRolesWithoutPermissions() {
        return roleService.getRolesWithoutPermissions();
    }

}