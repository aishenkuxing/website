package com.cn.website.aware;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;

import com.cn.website.common.service.impl.HomeServiceImpl2;

/**
 * 获取ApplicationContextAware 上下文织入
 * @author Administrator
 *
 */
@Component
public class WebContextUtil implements ApplicationContextAware {

	private static AnnotationConfigWebApplicationContext appContext;
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.appContext = (AnnotationConfigWebApplicationContext) applicationContext;
	}

	public ApplicationContext getApplicationContext() {
		return appContext;
	}
	
	public static Object getBean(String paramString)
	  {
	    return appContext.getBean(paramString);
	  }
	
}
