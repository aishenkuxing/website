package com.cn.website.common.entity;

/**
 * @author huangjiacheng
 * return message
 * @since
 */
public class MessageObject<T> extends  MessageNotice{
   
	private T data;

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}
	 
}
