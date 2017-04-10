package com.cn.website.advise.support;

import java.lang.reflect.Method;
import java.util.List;

import org.springframework.aop.framework.AdvisedSupport;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSiteAdvisedSupport extends AdvisedSupport {

	/** use serialVersionUID from Spring 2.0 for interoperability */
	private static final long serialVersionUID = 1651364800145442165L;

	@Override
	public List<Object> getInterceptorsAndDynamicInterceptionAdvice(Method method, Class<?> targetClass) {
		
		System.out.println(method);
		
		return super.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
		
		
	}

	
}
