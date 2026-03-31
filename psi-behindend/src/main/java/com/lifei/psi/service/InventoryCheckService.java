package com.lifei.psi.service;

import com.lifei.psi.entity.InventoryCheck;
import com.lifei.psi.entity.InventoryCheckItem;
import com.lifei.psi.entity.Inventory;
import com.lifei.psi.mapper.InventoryCheckMapper;
import com.lifei.psi.mapper.InventoryCheckItemMapper;
import com.lifei.psi.mapper.InventoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InventoryCheckService {

    @Autowired
    private InventoryCheckMapper checkMapper;

    @Autowired
    private InventoryCheckItemMapper checkItemMapper;

    @Autowired
    private InventoryMapper inventoryMapper;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private InventoryReceiptService receiptService;

    // 获取所有盘点单
    public List<InventoryCheck> getAllChecks() {
        return checkMapper.findAll();
    }

    // 根据ID获取盘点单
    public InventoryCheck getCheckById(Long id) {
        return checkMapper.findById(id);
    }

    // 获取盘点明细
    public List<InventoryCheckItem> getCheckItems(Long checkId) {
        return checkItemMapper.findByCheckId(checkId);
    }

    // 根据仓库查询
    public List<InventoryCheck> getChecksByWarehouse(Long warehouseId) {
        return checkMapper.findByWarehouse(warehouseId);
    }

    // 根据盘点类型查询
    public List<InventoryCheck> getChecksByType(String checkType) {
        return checkMapper.findByCheckType(checkType);
    }

    // 根据盘点人查询
    public List<InventoryCheck> getChecksByChecker(String checker) {
        return checkMapper.findByChecker(checker);
    }

    // 根据状态查询
    public List<InventoryCheck> getChecksByStatus(String status) {
        return checkMapper.findByStatus(status);
    }

    // 创建盘点单
    @Transactional
    public InventoryCheck createCheck(InventoryCheck check, List<InventoryCheckItem> items) {
        // 生成盘点单号
        check.setCheckNo(generateCheckNo());
        check.setCheckDate(LocalDateTime.now());
        check.setCreatedTime(LocalDateTime.now());
        check.setUpdatedTime(LocalDateTime.now());
        
        // 插入盘点单
        checkMapper.insert(check);
        
        // 插入明细并计算汇总数据
        BigDecimal totalGainQuantity = BigDecimal.ZERO;
        BigDecimal totalLossQuantity = BigDecimal.ZERO;
        BigDecimal totalGainAmount = BigDecimal.ZERO;
        BigDecimal totalLossAmount = BigDecimal.ZERO;
        
        if (items != null && !items.isEmpty()) {
            for (InventoryCheckItem item : items) {
                item.setCheckId(check.getId());
                
                // 获取单位成本
                BigDecimal unitCost = inventoryService.getUnitCost(check.getWarehouseId(), item.getProductId());
                item.setUnitCost(unitCost);
                item.setDifferenceAmount(item.getDifferenceQuantity().multiply(unitCost));
                
                // 累计汇总数据
                if ("GAIN".equals(item.getDifferenceType())) {
                    totalGainQuantity = totalGainQuantity.add(item.getDifferenceQuantity());
                    totalGainAmount = totalGainAmount.add(item.getDifferenceAmount());
                } else if ("LOSS".equals(item.getDifferenceType())) {
                    totalLossQuantity = totalLossQuantity.add(item.getDifferenceQuantity().abs());
                    totalLossAmount = totalLossAmount.add(item.getDifferenceAmount().abs());
                }
                
                checkItemMapper.insert(item);
            }
        }
        
        // 更新汇总数据
        check.setTotalGainQuantity(totalGainQuantity);
        check.setTotalLossQuantity(totalLossQuantity);
        check.setTotalGainAmount(totalGainAmount);
        check.setTotalLossAmount(totalLossAmount);
        checkMapper.update(check);
        
        return check;
    }

    // 自动生成盘点明细（基于当前库存）
    @Transactional
    public InventoryCheck createCheckWithCurrentInventory(InventoryCheck check) {
        // 生成盘点单号
        check.setCheckNo(generateCheckNo());
        check.setCheckDate(LocalDateTime.now());
        check.setCreatedTime(LocalDateTime.now());
        check.setUpdatedTime(LocalDateTime.now());
        
        // 插入盘点单
        checkMapper.insert(check);
        
        // 获取仓库当前库存
        List<Inventory> inventories = inventoryMapper.findByWarehouse(check.getWarehouseId());
        
        for (Inventory inventory : inventories) {
            InventoryCheckItem item = new InventoryCheckItem();
            item.setCheckId(check.getId());
            item.setProductId(inventory.getProductId());
            item.setBookQuantity(inventory.getQuantity());
            item.setActualQuantity(inventory.getQuantity()); // 默认实盘数量等于账面数量
            item.setDifferenceQuantity(BigDecimal.ZERO);
            item.setUnitCost(inventory.getUnitCost());
            item.setDifferenceAmount(BigDecimal.ZERO);
            item.setDifferenceType("NORMAL");
            
            checkItemMapper.insert(item);
        }
        
        return check;
    }

    // 更新盘点单
    @Transactional
    public InventoryCheck updateCheck(InventoryCheck check, List<InventoryCheckItem> items) {
        check.setUpdatedTime(LocalDateTime.now());
        
        // 删除原有明细
        checkItemMapper.deleteByCheckId(check.getId());
        
        // 插入新明细并重新计算汇总数据
        BigDecimal totalGainQuantity = BigDecimal.ZERO;
        BigDecimal totalLossQuantity = BigDecimal.ZERO;
        BigDecimal totalGainAmount = BigDecimal.ZERO;
        BigDecimal totalLossAmount = BigDecimal.ZERO;
        
        if (items != null && !items.isEmpty()) {
            for (InventoryCheckItem item : items) {
                item.setCheckId(check.getId());
                
                // 重新计算差异
                item.setDifferenceQuantity(item.getActualQuantity().subtract(item.getBookQuantity()));
                
                // 判断差异类型
                int comparison = item.getDifferenceQuantity().compareTo(BigDecimal.ZERO);
                if (comparison > 0) {
                    item.setDifferenceType("GAIN");
                } else if (comparison < 0) {
                    item.setDifferenceType("LOSS");
                } else {
                    item.setDifferenceType("NORMAL");
                }
                
                // 计算差异金额
                if (item.getUnitCost() == null) {
                    BigDecimal unitCost = inventoryService.getUnitCost(check.getWarehouseId(), item.getProductId());
                    item.setUnitCost(unitCost);
                }
                item.setDifferenceAmount(item.getDifferenceQuantity().multiply(item.getUnitCost()));
                
                // 累计汇总数据
                if ("GAIN".equals(item.getDifferenceType())) {
                    totalGainQuantity = totalGainQuantity.add(item.getDifferenceQuantity());
                    totalGainAmount = totalGainAmount.add(item.getDifferenceAmount());
                } else if ("LOSS".equals(item.getDifferenceType())) {
                    totalLossQuantity = totalLossQuantity.add(item.getDifferenceQuantity().abs());
                    totalLossAmount = totalLossAmount.add(item.getDifferenceAmount().abs());
                }
                
                checkItemMapper.insert(item);
            }
        }
        
        // 更新汇总数据
        check.setTotalGainQuantity(totalGainQuantity);
        check.setTotalLossQuantity(totalLossQuantity);
        check.setTotalGainAmount(totalGainAmount);
        check.setTotalLossAmount(totalLossAmount);
        checkMapper.update(check);
        
        return check;
    }

    // 完成盘点
    public boolean completeCheck(Long id) {
        return updateCheckStatus(id, "COMPLETED");
    }

    // 审核盘点
    public boolean approveCheck(Long id) {
        return updateCheckStatus(id, "APPROVED");
    }

    // 处理盘点差异（生成盘盈盘亏入库单）
    @Transactional
    public boolean processCheck(Long id) {
        InventoryCheck check = checkMapper.findById(id);
        if (check == null || !"APPROVED".equals(check.getStatus())) {
            return false;
        }
        
        List<InventoryCheckItem> items = checkItemMapper.findByCheckId(id);
        
        // 处理盘盈和盘亏
        for (InventoryCheckItem item : items) {
            if ("NORMAL".equals(item.getDifferenceType())) {
                continue;
            }
            
            BigDecimal quantity = item.getDifferenceQuantity().abs();
            String businessType = "GAIN".equals(item.getDifferenceType()) ? "INVENTORY_GAIN" : "INVENTORY_LOSS";
            
            if ("GAIN".equals(item.getDifferenceType())) {
                // 盘盈入库
                inventoryService.receiveInventory(
                    check.getWarehouseId(),
                    item.getProductId(),
                    quantity,
                    item.getUnitCost(),
                    businessType,
                    check.getCheckNo(),
                    check.getChecker()
                );
            } else {
                // 盘亏出库
                inventoryService.issueInventory(
                    check.getWarehouseId(),
                    item.getProductId(),
                    quantity,
                    businessType,
                    check.getCheckNo(),
                    check.getChecker()
                );
            }
        }
        
        return updateCheckStatus(id, "PROCESSED");
    }

    // 更新盘点状态
    public boolean updateCheckStatus(Long id, String status) {
        return checkMapper.updateStatus(id, status) > 0;
    }

    // 删除盘点单
    @Transactional
    public boolean deleteCheck(Long id) {
        // 先删除明细
        checkItemMapper.deleteByCheckId(id);
        // 再删除主表
        return checkMapper.deleteById(id) > 0;
    }

    // 生成盘点单号
    private String generateCheckNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "IC" + dateStr + String.format("%04d", System.currentTimeMillis() % 10000);
    }
}