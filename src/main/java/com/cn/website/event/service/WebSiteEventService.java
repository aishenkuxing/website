package com.cn.website.event.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.stereotype.Component;

import com.cn.website.event.WebSiteEvent;

@Component
public class WebSiteEventService implements ApplicationEventPublisherAware {

	private ApplicationEventPublisher publisher;
	
	@Override
	public void setApplicationEventPublisher(ApplicationEventPublisher publisher) {
		this.publisher=publisher;
	}
	
	/***
	 * 监听用户登入
	 * 当调用的时候自动分发到 WebSiteListEvent 进行事件处理
	 * @param username
	 * @param userpass
	 */
	public void userLogin(String username, String userpass) {
		WebSiteEvent event = new WebSiteEvent(this,username,userpass);
		publisher.publishEvent(event);
	}
	
	//@EventListener
	//public void processWebSiteListEvent(ApplicationEvent event) {
	// notify appropriate parties via notificationAddress...
	//}
	
	
}
