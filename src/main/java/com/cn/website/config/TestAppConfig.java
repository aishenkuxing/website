package com.cn.website.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.cn.website.common.entity.Student;
import com.cn.website.condition.WindowsCondition;
import com.cn.website.test.bean.Bar;
import com.cn.website.test.bean.Food;

@Configuration
//@Profile("dev")
public class TestAppConfig {

	@Bean(destroyMethod="destroy")
	public Food foo() {
		return new Food();
	}
	
	@Bean(initMethod="init")
	@Conditional(WindowsCondition.class)
	public Bar bar() {
		return new Bar();
	}
	//@Conditional(value = {HomeServiceImpl.class})
	@Bean(name="student")
	@Primary
	public Student student(){
		Student s=new Student();
		s.setName("1111");
		return s;
	}
	
	@Bean(name="student1")
	public Student student1(){
		Student s=new Student();
		s.setName("2222");
		return s;
	}
	
//	@Required
//	@Bean
//	public Student getStudent(Student s){
//		System.out.println(s.getName());
//		return s;
//	}
}
