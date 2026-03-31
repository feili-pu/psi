package com.lifei.psi.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 权限检查注解
 * 用于标记需要权限验证的方法
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    
    /**
     * 需要的权限编码
     * 支持多个权限，满足其中一个即可访问
     */
    String[] value();
    
    /**
     * 权限检查模式
     * AND: 需要拥有所有指定权限
     * OR: 只需要拥有其中一个权限（默认）
     */
    LogicalOperator logical() default LogicalOperator.OR;
    
    /**
     * 是否允许超级管理员跳过权限检查
     * 默认为 true
     */
    boolean allowAdmin() default true;
    
    /**
     * 权限检查失败时的错误消息
     */
    String message() default "权限不足，无法访问该资源";
    
    /**
     * 逻辑操作符枚举
     */
    enum LogicalOperator {
        AND, OR
    }
}