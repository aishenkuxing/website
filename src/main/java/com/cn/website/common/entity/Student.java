package com.cn.website.common.entity;

import org.springframework.beans.factory.annotation.Required;

public class Student {
   private String id;
   private String name;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	@Required
	public void setName(String name) {
		this.name = name;
	}
}
