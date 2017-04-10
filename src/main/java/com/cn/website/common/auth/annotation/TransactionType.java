package com.cn.website.common.auth.annotation;

public enum TransactionType {
	/**
	 * 修改操作
	 */
   Modify,
   /**
    * 读取操作
    */
   Get,
   /**
    * 添加操作
    */
   Insert,
   /**
    * 删除操作 
    */
   Delete
}
