package com.lifei.psi.service;

import com.lifei.psi.entity.*;
import com.lifei.psi.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ProductAssemblyService {

    @Autowired
    private ProductAssemblyMapper assemblyMapper;

    @Autowired
    private BOMMapper bomMapper;

    @Autowired
    private BOMItemMapper bomItemMapper;

    @Autowired
    private InventoryService inventoryService;

    // 获取所有产品组装单
    public List<ProductAssembly> getAllAssemblies() {
        return assemblyMapper.findAll();
    }

    // 根据ID获取产品组装单
    public ProductAssembly getAssemblyById(Long id) {
        return assemblyMapper.findById(id);
    }

    // 根据BOM ID查询
    public List<ProductAssembly> getAssembliesByBomId(Long bomId) {
        return assemblyMapper.findByBomId(bomId);
    }

    // 根据操作员查询
    public List<ProductAssembly> getAssembliesByOperator(String operator) {
        return assemblyMapper.findByOperator(operator);
    }

    // 根据状态查询
    public List<ProductAssembly> getAssembliesByStatus(String status) {
        return assemblyMapper.findByStatus(status);
    }

    // 根据仓库查询
    public List<ProductAssembly> getAssembliesByWarehouse(Long warehouseId) {
        return assemblyMapper.findByWarehouse(warehouseId);
    }

    // 创建产品组装单
    @Transactional
    public ProductAssembly createAssembly(ProductAssembly assembly) {
        // 生成组装单号
        assembly.setAssemblyNo(generateAssemblyNo());
        assembly.setAssemblyDate(LocalDateTime.now());
        assembly.setCreatedTime(LocalDateTime.now());
        assembly.setUpdatedTime(LocalDateTime.now());
        
        // 插入组装单
        assemblyMapper.insert(assembly);
        
        return assembly;
    }

    // 更新产品组装单
    @Transactional
    public ProductAssembly updateAssembly(ProductAssembly assembly) {
        assembly.setUpdatedTime(LocalDateTime.now());
        assemblyMapper.update(assembly);
        return assembly;
    }

    // 审核组装单
    public boolean approveAssembly(Long id) {
        return updateAssemblyStatus(id, "APPROVED");
    }

    // 执行组装
    @Transactional
    public boolean processAssembly(Long id) {
        ProductAssembly assembly = assemblyMapper.findById(id);
        if (assembly == null || !"APPROVED".equals(assembly.getStatus())) {
            return false;
        }
        
        // 获取BOM信息
        BOM bom = bomMapper.findById(assembly.getBomId());
        if (bom == null) {
            throw new RuntimeException("BOM不存在");
        }
        
        // 获取BOM明细
        List<BOMItem> bomItems = bomItemMapper.findByBomId(assembly.getBomId());
        if (bomItems.isEmpty()) {
            throw new RuntimeException("BOM明细为空");
        }
        
        // 检查原料库存并出库
        for (BOMItem bomItem : bomItems) {
            BigDecimal requiredQty = bomItem.getQuantity().multiply(assembly.getAssemblyQuantity());
            
            // 检查库存
            if (!inventoryService.checkInventory(assembly.getWarehouseId(), bomItem.getMaterialId(), requiredQty)) {
                throw new RuntimeException("原料库存不足: " + bomItem.getMaterialId());
            }
            
            // 出库
            boolean success = inventoryService.issueInventory(
                assembly.getWarehouseId(), 
                bomItem.getMaterialId(), 
                requiredQty,
                "ASSEMBLY",
                assembly.getAssemblyNo(),
                assembly.getOperator()
            );
            
            if (!success) {
                throw new RuntimeException("原料出库失败: " + bomItem.getMaterialId());
            }
        }
        
        // 成品入库
        BigDecimal productQuantity = assembly.getAssemblyQuantity();
        BigDecimal unitCost = calculateAssemblyCost(assembly.getBomId(), assembly.getWarehouseId());
        
        boolean success = inventoryService.receiveInventory(
            assembly.getWarehouseId(), 
            bom.getProductId(), 
            productQuantity,
            unitCost,
            "ASSEMBLY",
            assembly.getAssemblyNo(),
            assembly.getOperator()
        );
        
        if (!success) {
            throw new RuntimeException("成品入库失败");
        }
        
        return updateAssemblyStatus(id, "ASSEMBLED");
    }

    // 计算组装成本
    private BigDecimal calculateAssemblyCost(Long bomId, Long warehouseId) {
        List<BOMItem> bomItems = bomItemMapper.findByBomId(bomId);
        BigDecimal totalCost = BigDecimal.ZERO;
        
        for (BOMItem bomItem : bomItems) {
            BigDecimal unitCost = inventoryService.getUnitCost(warehouseId, bomItem.getMaterialId());
            BigDecimal itemCost = bomItem.getQuantity().multiply(unitCost);
            totalCost = totalCost.add(itemCost);
        }
        
        return totalCost;
    }

    // 更新组装状态
    public boolean updateAssemblyStatus(Long id, String status) {
        return assemblyMapper.updateStatus(id, status) > 0;
    }

    // 取消组装
    public boolean cancelAssembly(Long id) {
        return updateAssemblyStatus(id, "CANCELLED");
    }

    // 删除产品组装单
    @Transactional
    public boolean deleteAssembly(Long id) {
        return assemblyMapper.deleteById(id) > 0;
    }

    // 生成组装单号
    private String generateAssemblyNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "PA" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }
}