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
public class ProductDisassemblyService {

    @Autowired
    private ProductDisassemblyMapper disassemblyMapper;

    @Autowired
    private BOMMapper bomMapper;

    @Autowired
    private BOMItemMapper bomItemMapper;

    @Autowired
    private InventoryService inventoryService;

    // 获取所有产品拆卸单
    public List<ProductDisassembly> getAllDisassemblies() {
        return disassemblyMapper.findAll();
    }

    // 根据ID获取产品拆卸单
    public ProductDisassembly getDisassemblyById(Long id) {
        return disassemblyMapper.findById(id);
    }

    // 根据BOM ID查询
    public List<ProductDisassembly> getDisassembliesByBomId(Long bomId) {
        return disassemblyMapper.findByBomId(bomId);
    }

    // 根据操作员查询
    public List<ProductDisassembly> getDisassembliesByOperator(String operator) {
        return disassemblyMapper.findByOperator(operator);
    }

    // 根据状态查询
    public List<ProductDisassembly> getDisassembliesByStatus(String status) {
        return disassemblyMapper.findByStatus(status);
    }

    // 根据仓库查询
    public List<ProductDisassembly> getDisassembliesByWarehouse(Long warehouseId) {
        return disassemblyMapper.findByWarehouse(warehouseId);
    }

    // 创建产品拆卸单
    @Transactional
    public ProductDisassembly createDisassembly(ProductDisassembly disassembly) {
        // 生成拆卸单号
        disassembly.setDisassemblyNo(generateDisassemblyNo());
        if (isBlank(disassembly.getStatus())) {
            disassembly.setStatus("PENDING");
        }
        disassembly.setDisassemblyDate(LocalDateTime.now());
        disassembly.setCreatedTime(LocalDateTime.now());
        disassembly.setUpdatedTime(LocalDateTime.now());
        
        // 插入拆卸单
        disassemblyMapper.insert(disassembly);
        
        return disassembly;
    }

    // 更新产品拆卸单
    @Transactional
    public ProductDisassembly updateDisassembly(ProductDisassembly disassembly) {
        disassembly.setUpdatedTime(LocalDateTime.now());
        disassemblyMapper.update(disassembly);
        return disassembly;
    }

    // 审核拆卸单
    public boolean approveDisassembly(Long id) {
        return updateDisassemblyStatus(id, "APPROVED");
    }

    // 执行拆卸
    @Transactional
    public boolean processDisassembly(Long id) {
        ProductDisassembly disassembly = disassemblyMapper.findById(id);
        if (disassembly == null || !"APPROVED".equals(disassembly.getStatus())) {
            return false;
        }
        
        // 获取BOM信息
        BOM bom = bomMapper.findById(disassembly.getBomId());
        if (bom == null) {
            throw new RuntimeException("BOM不存在");
        }
        
        // 获取BOM明细
        List<BOMItem> bomItems = bomItemMapper.findByBomId(disassembly.getBomId());
        if (bomItems.isEmpty()) {
            throw new RuntimeException("BOM明细为空");
        }
        
        // 检查成品库存并出库
        BigDecimal productQuantity = disassembly.getDisassemblyQuantity();
        
        if (!inventoryService.checkInventory(disassembly.getWarehouseId(), bom.getProductId(), productQuantity)) {
            throw new RuntimeException("成品库存不足");
        }
        
        // 成品出库
        boolean success = inventoryService.issueInventory(
            disassembly.getWarehouseId(), 
            bom.getProductId(), 
            productQuantity,
            "DISASSEMBLY",
            disassembly.getDisassemblyNo(),
            disassembly.getOperator()
        );
        
        if (!success) {
            throw new RuntimeException("成品出库失败");
        }
        
        // 原料入库
        for (BOMItem bomItem : bomItems) {
            BigDecimal materialQuantity = bomItem.getQuantity().multiply(disassembly.getDisassemblyQuantity());
            BigDecimal unitCost = inventoryService.getUnitCost(disassembly.getWarehouseId(), bomItem.getMaterialId());
            
            success = inventoryService.receiveInventory(
                disassembly.getWarehouseId(), 
                bomItem.getMaterialId(), 
                materialQuantity,
                unitCost,
                "DISASSEMBLY",
                disassembly.getDisassemblyNo(),
                disassembly.getOperator()
            );
            
            if (!success) {
                throw new RuntimeException("原料入库失败: " + bomItem.getMaterialId());
            }
        }
        
        return updateDisassemblyStatus(id, "DISASSEMBLED");
    }

    // 更新拆卸状态
    public boolean updateDisassemblyStatus(Long id, String status) {
        return disassemblyMapper.updateStatus(id, status) > 0;
    }

    // 取消拆卸
    public boolean cancelDisassembly(Long id) {
        return updateDisassemblyStatus(id, "CANCELLED");
    }

    // 删除产品拆卸单
    @Transactional
    public boolean deleteDisassembly(Long id) {
        return disassemblyMapper.deleteById(id) > 0;
    }

    // 生成拆卸单号
    private String generateDisassemblyNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "PD" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
