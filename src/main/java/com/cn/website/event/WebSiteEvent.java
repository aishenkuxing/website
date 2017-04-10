package com.cn.website.event;

import org.springframework.context.ApplicationEvent;
/**
 * 站点监听器
 * @author Administrator
 *
 */
public class WebSiteEvent extends ApplicationEvent{
	private String username;
  
	private String password;
	
	
	public WebSiteEvent(Object source,String username, String password) {
		super(source);
		this.username = username;
		this.password = password;
	}

}
