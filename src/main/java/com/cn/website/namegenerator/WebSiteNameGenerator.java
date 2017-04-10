package com.cn.website.namegenerator;

import org.springframework.beans.factory.annotation.AnnotatedBeanDefinition;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.AnnotationBeanNameGenerator;
import org.springframework.util.StringUtils;

/**
 * 注解策略
 * @author huangjiacheng
 *
 */
public class WebSiteNameGenerator extends AnnotationBeanNameGenerator {

	/**
	 * 设置注解监听
	 */
	@Override
	public String generateBeanName(BeanDefinition definition, BeanDefinitionRegistry registry) {
		if (definition instanceof AnnotatedBeanDefinition) {
			String beanName = determineBeanNameFromAnnotation((AnnotatedBeanDefinition) definition);
			if (StringUtils.hasText(beanName)) {
				// Explicit bean name found.
				if("homeServiceImpl".equals(beanName)){
					/**
					 * 更改装配类
					 */
					//System.out.println(definition.getBeanClassName());
					//definition.setBeanClassName("com.cn.website.common.service.impl.HomeServiceImpl2");
				}
				return beanName;
			}
		}
		return super.buildDefaultBeanName(definition, registry);
	}
}
