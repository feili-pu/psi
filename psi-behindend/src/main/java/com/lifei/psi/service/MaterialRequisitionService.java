package com.lifei.psi.service;

import com.lifei.psi.entity.*;
import com.lifei.psi.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class MaterialRequisitionService {

    @Autowired
    private MaterialRequisitionMapper requisitionMapper;

    @Autowired
    private MaterialRequisitionItemMapper requisitionItemMapper;

    @Autowired
    private BOMMapper bomMapper;

    @Autowired
    private BOMItemMapper bomItemMapper;

    @Autowired
    private InventoryService inventoryService;

    // 获取所有生产领料单
    public List<MaterialRequisition> getAllRequisitions() {
        return requisitionMapper.findAll();
    }

    // 根据ID获取生产领料单
    public MaterialRequisition getRequisitionById(Long id) {
        return requisitionMapper.findById(id);
    }

    // 获取领料明细
    public List<MaterialRequisitionItem> getRequisitionItems(Long requisitionId) {
        return requisitionItemMapper.findByRequisitionId(requisitionId);
    }

    // 根据部门搜索
    public List<MaterialRequisition> searchByDepartment(String department) {
        return requisitionMapper.findByDepartment(department);
    }

    // 根据申请人查询
    public List<MaterialRequisition> getRequisitionsByApplicant(String applicant) {
        return requisitionMapper.findByApplicant(applicant);
    }

    // 根据状态查询
    public List<MaterialRequisition> getRequisitionsByStatus(String status) {
        return requisitionMapper.findByStatus(status);
    }

    // 根据BOM ID查询
    public List<MaterialRequisition> getRequisitionsByBomId(Long bomId) {
        return requisitionMapper.findByBomId(bomId);
    }

    // 创建生产领料单
    @Transactional
    public MaterialRequisition createRequisition(MaterialRequisition requisition, List<MaterialRequisitionItem> items) {
        // 生成领料单号
        requisition.setRequisitionNo(generateRequisitionNo());
        requisition.setRequisitionDate(LocalDateTime.now());
        requisition.setCreatedTime(LocalDateTime.now());
        requisition.setUpdatedTime(LocalDateTime.now());
        
        // 插入领料单
        requisitionMapper.insert(requisition);
        
        // 插入明细
        if (items != null && !items.isEmpty()) {
            for (MaterialRequisitionItem item : items) {
                item.setRequisitionId(requisition.getId());
                item.setIssuedQuantity(BigDecimal.ZERO);
                // 获取库存成本
                BigDecimal unitCost = inventoryService.getUnitCost(requisition.getWarehouseId(), item.getProductId());
                item.setUnitCost(unitCost);
                item.setTotalCost(item.getRequiredQuantity().multiply(unitCost));
                requisitionItemMapper.insert(item);
            }
        }
        
        return requisition;
    }

    // 根据BOM创建领料单
    @Transactional
    public MaterialRequisition createRequisitionFromBOM(Long bomId, MaterialRequisition requisitionInfo) {
        // 获取BOM信息
        BOM bom = bomMapper.findById(bomId);
        if (bom == null) {
            throw new RuntimeException("BOM不存在");
        }
        
        // 获取BOM明细
        List<BOMItem> bomItems = bomItemMapper.findByBomId(bomId);
        if (bomItems.isEmpty()) {
            throw new RuntimeException("BOM明细为空");
        }
        
        // 设置BOM ID
        requisitionInfo.setBomId(bomId);
        
        // 转换BOM明细为领料明细
        List<MaterialRequisitionItem> requisitionItems = new ArrayList<>();
        BigDecimal productionQty = requisitionInfo.getProductionQuantity() != null ? 
            requisitionInfo.getProductionQuantity() : BigDecimal.ONE;
            
        for (BOMItem bomItem : bomItems) {
            MaterialRequisitionItem item = new MaterialRequisitionItem();
            item.setProductId(bomItem.getMaterialId());
            item.setUnit(bomItem.getUnit());
            
            // 计算需求数量 = BOM用量 * 生产数量 * (1 + 损耗率)
            BigDecimal requiredQty = bomItem.getQuantity()
                .multiply(productionQty)
                .multiply(BigDecimal.ONE.add(bomItem.getLossRate().divide(new BigDecimal("100"))));
            item.setRequiredQuantity(requiredQty);
            
            item.setRemarks(bomItem.getRemarks());
            requisitionItems.add(item);
        }
        
        return createRequisition(requisitionInfo, requisitionItems);
    }

    // 更新生产领料单
    @Transactional
    public MaterialRequisition updateRequisition(MaterialRequisition requisition, List<MaterialRequisitionItem> items) {
        requisition.setUpdatedTime(LocalDateTime.now());
        
        // 更新领料单
        requisitionMapper.update(requisition);
        
        // 删除原有明细
        requisitionItemMapper.deleteByRequisitionId(requisition.getId());
        
        // 插入新明细
        if (items != null && !items.isEmpty()) {
            for (MaterialRequisitionItem item : items) {
                item.setRequisitionId(requisition.getId());
                if (item.getIssuedQuantity() == null) {
                    item.setIssuedQuantity(BigDecimal.ZERO);
                }
                // 获取库存成本
                BigDecimal unitCost = inventoryService.getUnitCost(requisition.getWarehouseId(), item.getProductId());
                item.setUnitCost(unitCost);
                item.setTotalCost(item.getRequiredQuantity().multiply(unitCost));
                requisitionItemMapper.insert(item);
            }
        }
        
        return requisition;
    }

    // 审核领料单
    public boolean approveRequisition(Long id) {
        return updateRequisitionStatus(id, "APPROVED");
    }

    // 发料
    @Transactional
    public boolean issueRequisition(Long id) {
        MaterialRequisition requisition = requisitionMapper.findById(id);
        if (requisition == null || !"APPROVED".equals(requisition.getStatus())) {
            return false;
        }
        
        List<MaterialRequisitionItem> items = requisitionItemMapper.findByRequisitionId(id);
        
        // 检查库存并出库
        for (MaterialRequisitionItem item : items) {
            boolean success = inventoryService.issueInventory(
                requisition.getWarehouseId(), 
                item.getProductId(), 
                item.getRequiredQuantity(),
                "REQUISITION",
                requisition.getRequisitionNo(),
                requisition.getApplicant()
            );
            
            if (!success) {
                throw new RuntimeException("物料 " + item.getProductId() + " 库存不足");
            }
            
            // 更新已发数量
            requisitionItemMapper.updateIssuedQuantity(item.getId(), item.getRequiredQuantity());
        }
        
        return updateRequisitionStatus(id, "ISSUED");
    }

    // 更新领料状态
    public boolean updateRequisitionStatus(Long id, String status) {
        return requisitionMapper.updateStatus(id, status) > 0;
    }

    // 取消领料
    public boolean cancelRequisition(Long id) {
        return updateRequisitionStatus(id, "CANCELLED");
    }

    // 删除生产领料单
    @Transactional
    public boolean deleteRequisition(Long id) {
        // 先删除明细
        requisitionItemMapper.deleteByRequisitionId(id);
        // 再删除主表
        return requisitionMapper.deleteById(id) > 0;
    }

    // 生成领料单号
    private String generateRequisitionNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "MR" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }
}