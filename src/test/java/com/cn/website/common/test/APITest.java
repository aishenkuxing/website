package com.cn.website.common.test;

/**
 * 接口测试
 * @author huangjiacheng
 *
 */
public interface APITest<T> {
  int i=1;
  
  default void getTestApi(T t){
	  System.out.println("来到世界的尽头");
  }
}
