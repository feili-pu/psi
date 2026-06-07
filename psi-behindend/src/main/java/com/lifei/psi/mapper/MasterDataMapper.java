package com.lifei.psi.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MasterDataMapper {

    @Select("SELECT id FROM product WHERE product_code = #{productCode} LIMIT 1")
    Long findProductIdByCode(@Param("productCode") String productCode);

    @Select("SELECT id FROM supplier WHERE supplier_name = #{supplierName} LIMIT 1")
    Long findSupplierIdByName(@Param("supplierName") String supplierName);

    @Select("SELECT id FROM warehouse WHERE warehouse_code = #{warehouseCode} LIMIT 1")
    Long findWarehouseIdByCode(@Param("warehouseCode") String warehouseCode);

    @Select("SELECT id FROM warehouse ORDER BY id LIMIT 1")
    Long findDefaultWarehouseId();
}
