package com.cn.website.event;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;

public class WebSiteListEvent {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 处理监听事件处理
	 * 接受不同类型 监听
	 */
	@EventListener
	public void processWebSiteListEvent(ApplicationEvent event) {
	   // notify appropriate parties via notificationAddress...
		 System.out.println(event.getClass()); 
	}

}
