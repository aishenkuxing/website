package com.cn.website.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.cn.website.aware.WebSiteBeanWare;
import com.cn.website.common.auth.PermissionAuth;
import com.cn.website.common.dao.UserCenterDao;
import com.cn.website.common.dao.impl.UserCenterDaoImpl;
import com.cn.website.config.DataSourceHolder;

/**
 * 站点拦截
 * @author huangjiacheng
 *
 */
public class WebSiteLocaleInterceptor implements HandlerInterceptor{
	
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView arg3)
			throws Exception {
		
		
	}

	@SuppressWarnings("unused")
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {	
		  /**
		   *  设置动态连接库
		   */
		{
			if(1==1){
				///主库设置
			}else{
				///分库设置
				 DataSourceHolder.setDataSource("dataSourceTest");
			}
			
		}
		/**
		 * 动态切换注入
		 */
		{
			if(1!=1){
				BeanDefinition beanDefinition=WebSiteBeanWare.beanFactory.getBeanDefinition("homeServiceImpl");
				
				beanDefinition.setBeanClassName("com.cn.website.common.service.impl.HomeServiceImpl2");
	
				WebSiteBeanWare.beanFactory.registerBeanDefinition("homeServiceImpl", beanDefinition);
			}
		}
		 
		  if(handler.getClass().isAssignableFrom(HandlerMethod.class)){
			  /**
			   * 获取权拦截
			   */
			  PermissionAuth permissionAuth = ((HandlerMethod) handler).getMethodAnnotation(PermissionAuth.class);
			  if(permissionAuth!=null){
				  /***-- 权限判断操作--*/
				  switch(permissionAuth.role()){
				  	case  ADMIN :{
				  		break;
				  	}
				  	case  USER :{
				  		break;
				  	}
				  	case  NULL :{
				  		
				  		break;
				  	}
				  }
			  }
		  }
		return true;
	}

}
