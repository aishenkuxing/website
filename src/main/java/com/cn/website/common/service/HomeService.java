package com.cn.website.common.service;

import java.util.List;

import com.cn.website.common.bean.UserInfo;

public interface HomeService {
    public void defaultMethod();
    
    public String getVersion();
    
    public UserInfo getUserInfo(long id);
    
    List<UserInfo> getUserInfoList(UserInfo info);
}
