package com.cn.website.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.Filter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.filter.RequestContextFilter;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import com.cn.website.config.filter.InitWebSiteFilter;
/***
 * 网站启动拦截器 spring入口
 * @author huangjiacheng
 *
 */
public class WebSiteApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer   {
	/***
	 * 启动 spring mvc
	 * ServletContext  Servlet上下文
	 */
	private Properties env = new Properties();//属性集合对象 
	
	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		System.out.println("启动项目");
		/**
		 * 获取配置信息
		 */
		InputStream  fis=this.getClass().getClassLoader().getResourceAsStream("configs/applicationContext.properties");
		
		try {
			env.load(fis);//将属性文件流装载到Properties对象中 
			fis.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		
	//	servletContext.addServlet("dispatcher",new DispatcherServlet());
		
		super.onStartup(servletContext);
		
		servletContext.addListener(org.springframework.web.context.request.RequestContextListener.class);
		/**
		 * 引入XML
		 */
//		XmlWebApplicationContext appContext = new XmlWebApplicationContext();
//		appContext.setConfigLocation("/WEB-INF/spring/dispatcher-config.xml");
		
//		/**
//		 * 同  <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>设置 spring拦截
//		 * 返回registration 注册对象
//		 */
//		ServletRegistration.Dynamic registration = servletContext.addServlet("dispatcher", new DispatcherServlet());
//		/**
//		 * 设置优先级<load-on-startup>1</load-on-startup>
//		 */
//		registration.setLoadOnStartup(1);
//		
//		/**
//		 * 设置拦截<url-pattern>/*</url-pattern>
//		 */
//		registration.addMapping("/");
		
	
	}

	@Override
	protected Class<?>[] getRootConfigClasses() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		// TODO Auto-generated method stub
		return new Class[]{WebSiteConfig.class};
	}

	/**
	 * 配置拦截路径
	 */
	@Override
	protected String[] getServletMappings() {
		return new String[]{"/"};
	}
	/**
	 * 配置过滤器
	 */
	@Override
	protected Filter[] getServletFilters() {
		/**
		 * 设置spring编码格式
		 */
		CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
		//设置 response 编码格式和 request保持一致
        characterEncodingFilter.setForceEncoding(true);
        characterEncodingFilter.setEncoding(env.getProperty("application.encoding"));
        
        /**
         * 初始化容器过滤器
         */
		InitWebSiteFilter initFilter=new InitWebSiteFilter();
		
		initFilter.setEncoding(env.getProperty("application.encoding"));
		/**
		 * 添加request Scope监听
		 */
		
		//RequestContextFilter requestContextFilter = new RequestContextFilter();
		
		//requestContextFilter.setBeanName("requestContextFilter");
		
		return new Filter[]{characterEncodingFilter,initFilter};
	}

}
