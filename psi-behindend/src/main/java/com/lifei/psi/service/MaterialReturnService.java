package com.lifei.psi.service;

import com.lifei.psi.entity.MaterialReturn;
import com.lifei.psi.entity.MaterialReturnItem;
import com.lifei.psi.mapper.MaterialReturnMapper;
import com.lifei.psi.mapper.MaterialReturnItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class MaterialReturnService {

    @Autowired
    private MaterialReturnMapper returnMapper;

    @Autowired
    private MaterialReturnItemMapper returnItemMapper;

    @Autowired
    private InventoryService inventoryService;

    // 获取所有生产退料单
    public List<MaterialReturn> getAllReturns() {
        return returnMapper.findAll();
    }

    // 根据ID获取生产退料单
    public MaterialReturn getReturnById(Long id) {
        return returnMapper.findById(id);
    }

    // 获取退料明细
    public List<MaterialReturnItem> getReturnItems(Long returnId) {
        return returnItemMapper.findByReturnId(returnId);
    }

    // 根据部门搜索
    public List<MaterialReturn> searchByDepartment(String department) {
        return returnMapper.findByDepartment(department);
    }

    // 根据退料人查询
    public List<MaterialReturn> getReturnsByReturner(String returner) {
        return returnMapper.findByReturner(returner);
    }

    // 根据状态查询
    public List<MaterialReturn> getReturnsByStatus(String status) {
        return returnMapper.findByStatus(status);
    }

    // 根据领料单ID查询
    public List<MaterialReturn> getReturnsByRequisitionId(Long requisitionId) {
        return returnMapper.findByRequisitionId(requisitionId);
    }

    // 创建生产退料单
    @Transactional
    public MaterialReturn createReturn(MaterialReturn materialReturn, List<MaterialReturnItem> items) {
        // 生成退料单号
        materialReturn.setReturnNo(generateReturnNo());
        if (isBlank(materialReturn.getStatus())) {
            materialReturn.setStatus("PENDING");
        }
        materialReturn.setReturnDate(LocalDateTime.now());
        materialReturn.setCreatedTime(LocalDateTime.now());
        materialReturn.setUpdatedTime(LocalDateTime.now());
        
        // 插入退料单
        returnMapper.insert(materialReturn);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (MaterialReturnItem item : items) {
                item.setReturnId(materialReturn.getId());
                // 获取库存成本
                BigDecimal unitCost = inventoryService.getUnitCost(materialReturn.getWarehouseId(), item.getProductId());
                item.setUnitCost(unitCost);
                item.setTotalCost(item.getReturnQuantity().multiply(unitCost));
                returnItemMapper.insert(item);
            }
        }
        
        return materialReturn;
    }

    // 更新生产退料单
    @Transactional
    public MaterialReturn updateReturn(MaterialReturn materialReturn, List<MaterialReturnItem> items) {
        materialReturn.setUpdatedTime(LocalDateTime.now());
        
        // 更新退料单
        returnMapper.update(materialReturn);
        
        // 删除原有明细
        returnItemMapper.deleteByReturnId(materialReturn.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (MaterialReturnItem item : items) {
                item.setReturnId(materialReturn.getId());
                // 获取库存成本
                BigDecimal unitCost = inventoryService.getUnitCost(materialReturn.getWarehouseId(), item.getProductId());
                item.setUnitCost(unitCost);
                item.setTotalCost(item.getReturnQuantity().multiply(unitCost));
                returnItemMapper.insert(item);
            }
        }
        
        return materialReturn;
    }

    // 审核退料单
    public boolean approveReturn(Long id) {
        return updateReturnStatus(id, "APPROVED");
    }

    // 退料入库
    @Transactional
    public boolean processReturn(Long id) {
        MaterialReturn materialReturn = returnMapper.findById(id);
        if (materialReturn == null || !"APPROVED".equals(materialReturn.getStatus())) {
            return false;
        }
        
        List<MaterialReturnItem> items = returnItemMapper.findByReturnId(id);
        
        // 退料入库
        for (MaterialReturnItem item : items) {
            boolean success = inventoryService.receiveInventory(
                materialReturn.getWarehouseId(), 
                item.getProductId(), 
                item.getReturnQuantity(),
                item.getUnitCost(),
                "RETURN",
                materialReturn.getReturnNo(),
                materialReturn.getReturner()
            );
            
            if (!success) {
                throw new RuntimeException("退料入库失败: " + item.getProductId());
            }
        }
        
        return updateReturnStatus(id, "RETURNED");
    }

    // 更新退料状态
    public boolean updateReturnStatus(Long id, String status) {
        return returnMapper.updateStatus(id, status) > 0;
    }

    // 取消退料
    public boolean cancelReturn(Long id) {
        return updateReturnStatus(id, "CANCELLED");
    }

    // 删除生产退料单
    @Transactional
    public boolean deleteReturn(Long id) {
        // 先删除明细
        returnItemMapper.deleteByReturnId(id);
        // 再删除主表
        return returnMapper.deleteById(id) > 0;
    }

    // 生成退料单号
    private String generateReturnNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "MRT" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
