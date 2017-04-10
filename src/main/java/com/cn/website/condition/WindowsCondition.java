package com.cn.website.condition;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.Conditional;
import org.springframework.core.type.AnnotatedTypeMetadata;
/**
 * ������������
 * @author Administrator
 *
 */
public class WindowsCondition implements Condition{

	/**
	 * �ж��Ƿ�Ϊwindowϵͳ  ��ʼ��Bean����
	 * @Conditional ע��ʹ��
	 */
	@Override
	public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
		// TODO Auto-generated method stub
		 return context.getEnvironment().getProperty("os.name").contains("Windows");  
	}

}
