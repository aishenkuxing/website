package com.cn.website.common.bean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cn.website.common.entity.MessageNotice;
import com.cn.website.common.entity.Student;

/**
 * @author huangjiacheng
 */
@Configuration
public class FactoryBean {

	@Bean(name="student")
	public Student Student(){
		System.out.println("student");
		Student s=new Student();
		s.setId("101");
		s.setName("张三");
		return s;
	} 
	
	@Bean(name="msg")
	@Autowired
	public MessageNotice Student2( Student student){
		System.out.println(student.getId());
		student.setName("李四");
		return null;
	}
}
