package com.cn.website.common.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cn.website.common.service.HomeService;

@Controller
@RequestMapping("swagger")
public class SwaggerController {

	@Autowired
	private HomeService homeServiceImpl;
	
	@RequestMapping("index")
	public void index(){
		//System.out.println(111);
	}
}
