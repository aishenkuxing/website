package com.cn.website.common.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Property;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.support.HibernateDaoSupport;
import org.springframework.stereotype.Repository;

import com.cn.website.common.bean.UserInfo;
import com.cn.website.common.dao.UserCenterDao;

@Repository("userCenterDaoImpl")
public class UserCenterDaoImpl extends HibernateDaoSupport  implements UserCenterDao  {
	
//	@Autowired
//	private SessionFactory sessionFactory;
	
	
	// Session session = currentSession();
	@Autowired 
    public void setSessionFactoryOverride(SessionFactory sessionFactory)  
    {  
        super.setSessionFactory(sessionFactory);  
    }  
	 
	 @Override
	 public void save(UserInfo info){
		Session session = currentSession();
		session.save(info);
	 }

	@Override
	public UserInfo get(long id) {
		Session session = currentSession();
		UserInfo info = session.get(UserInfo.class, id);
		//UserInfo crit = (UserInfo) session.createCriteria(UserInfo.class);
		return info;
	}
	
	@Override
	public List<UserInfo> getUserInfoList(UserInfo info) {
		DetachedCriteria query = DetachedCriteria.forClass(UserInfo.class).add(Property.forName("userName").eq("lilianjie"));
		Session session = currentSession();
		List results = query.getExecutableCriteria(session).setFirstResult(0).setMaxResults(2).list();
		return results;
	}
	
}
