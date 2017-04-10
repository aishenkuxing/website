package com.cn.website.config.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.commons.lang.StringUtils;

/**
 * Servlet Filter implementation class InitFilter
 * 过滤器 注解配置
 */
public class InitWebSiteFilter implements Filter {

	private String encoding;
	
	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		//System.out.println("filterConfig");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		//编码格式转换
		if(!StringUtils.isEmpty(encoding)) {
			request.setCharacterEncoding(encoding);
		}
		 
		 chain.doFilter(request, response);  
	}

	// 字符编码过滤器
   
    
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

 
}
