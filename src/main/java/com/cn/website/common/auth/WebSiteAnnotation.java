package com.cn.website.common.auth;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.cn.website.common.auth.annotation.PermissionType;
import com.cn.website.common.auth.annotation.TransactionType;

public  class WebSiteAnnotation {
	
	@Documented
	@Inherited
	@Target(ElementType.METHOD)
	@Retention(RetentionPolicy.RUNTIME)
	public static @interface PermissionAuth {
		PermissionType role() default PermissionType.NULL;
	}
	
	@Documented
	@Inherited
	@Target({ElementType.METHOD, ElementType.TYPE})
	@Retention(RetentionPolicy.RUNTIME)
	public static @interface TransactionAuth {
		TransactionType value() default TransactionType.Get;
	}

	@Documented
	@Inherited
	@Target({ElementType.METHOD, ElementType.TYPE})
	@Retention(RetentionPolicy.RUNTIME)
	public @interface WebEntityScan {
	    String[] value() default {};
	}

}
