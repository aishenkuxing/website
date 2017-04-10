package com.cn.website.common.dao;

public interface BaseDaoSupport<T> {
  
	/**
	 * 保存对象
	 * @param t
	 */
	public void save(T t);
	
	/**
	 * 获取对象
	 */
	public void get(Object id);
	
	
}
