package com.cn.website.common.dao;

import java.util.List;

import com.cn.website.common.bean.UserInfo;

public interface UserCenterDao {
	/**
	 * 保存
	 * @param info
	 */
	 public void save(UserInfo info);
	 
	 public UserInfo get(long id);
	 
	 public List<UserInfo> getUserInfoList(UserInfo info);
	 
}
