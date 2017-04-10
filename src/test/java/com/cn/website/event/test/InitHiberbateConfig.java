package com.cn.website.event.test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.Entity;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.Metadata;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.internal.log.ConnectionPoolingLogger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.stereotype.Component;

import com.cn.website.common.bean.UserInfo;
import com.cn.website.common.entity.MessageObject;
import com.cn.website.common.util.ClassScaner;
import com.cn.website.config.WebSiteConfig;
import com.cn.website.config.hibernateconfig.HibernateConfig;

@Component
public class InitHiberbateConfig {
	
	private static final ConnectionPoolingLogger log = ConnectionPoolingLogger.CONNECTIONS_LOGGER;
	
	private static  SessionFactory sessionFactory = null;
	
	Map<String,String> map= new HashMap<String,String>();
	
	protected void setUp() throws Exception {
		//加载入口
		final StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
				.loadProperties("configs/hibernate/hibernate.properties")
				.build();
		try {
			MetadataSources metadataSources=new MetadataSources( registry );
			Set<Class<?>> setClass= ClassScaner.scan("com.cn.*.common.bean", Entity.class);
			for (Class<?> class1 : setClass) {
				//System.out.println(class1.getName());
				metadataSources.addAnnotatedClass(class1);
			}
			Metadata metadata = metadataSources.buildMetadata();
			sessionFactory = metadata.buildSessionFactory();
		}
		catch (Exception e) {
			// The registry would be destroyed by the SessionFactory, but we had trouble building the SessionFactory
			// so destroy it manually.
			StandardServiceRegistryBuilder.destroy( registry );
		}
	}
	
	public static Session getSession(){
		return sessionFactory.openSession();
	}
	
	
	public static void main(String[] args) throws Exception {
		log.debug("开始启动~~");
		System.out.println("开始启动");
		//  @SuppressWarnings("resource")  
//	    ApplicationContext ctx = new AnnotationConfigApplicationContext(HibernateConfig.class);
//      SessionFactory sf = ctx.getBean("localSessionFactoryBean", SessionFactory.class); 
		
		
//	    System.out.println(); 
//	    MessageObject<List<UserInfo>> msg = new MessageObject<List<UserInfo>>();
//		Session session= sf.openSession();
		new InitHiberbateConfig().setUp();
		//SessionFactory sf = InitHiberbateConfig.getCurrentSession();
		Session session = getSession();
		try {
			Transaction tran=session.getTransaction();
			tran.begin();
//			UserInfo userInfo= new UserInfo();
//			userInfo.setName("李连杰");
//			userInfo.setUserName("lilianjie1");
//			userInfo.setPassword("123456");
//			session.save(userInfo);
			tran.commit();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			session.close();
		}
	}
}
