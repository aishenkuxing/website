package com.cn.website.config;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * 动态数据源集合
 * @author Administrator
 *
 */
public class DynamicDataSource extends AbstractRoutingDataSource implements InitializingBean {

	/**
	 * 设置数据源集合
	 * @return
	 */
	@Override
	protected Object determineCurrentLookupKey() {
		//System.out.println("更换数据源："+DataSourceHolder.getDataSource());
		 return DataSourceHolder.getDataSource();
	} 
}
