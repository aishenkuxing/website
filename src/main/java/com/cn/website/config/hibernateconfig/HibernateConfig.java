package com.cn.website.config.hibernateconfig;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;

import com.cn.website.common.auth.WebSiteAnnotation;
import com.cn.website.config.DynamicDataSource;

@Configuration
@PropertySources(value = { @PropertySource(value = { "classpath:configs/hibernate/hibernate.properties" }) })
@WebSiteAnnotation.WebEntityScan({
	"com.cn.*.common.bean"
	})
public class HibernateConfig {
	
	@Autowired
	private Environment env;
	
	private String url ;
	
	private String username;
	
	private String password;
	
	private String driver;
	
//	/**
//	 * 注解配置事物管理器
//	 * @param dataSource
//	 * @return
//	 */
//	@Bean(name="txManager")
//	@Autowired
//	public DataSourceTransactionManager dataSourceTransactionManager(@Qualifier("dataSource") DataSource dataSource){
//		DataSourceTransactionManager txManager= new  DataSourceTransactionManager();
//		txManager.setDataSource(dataSource);
//		return txManager;
//	}
	/**
	 * 设置数据源集合
	 * @return
	 */
//	@Bean(name="targetDataSources")
//	public Map<Object, Object> targetDataSources(){
//		Map<Object, Object> map= new HashMap<Object, Object>();
//		map.put("dataSource1", "dataSource1");
//		map.put("dataSource", "dataSource");
//		return map;
//	}
	
	/**
	 * 配置主连接变量
	 * @return
	 */
	@Bean(name="dataSource")
	public DataSource dataSource(){
		url = env.getProperty("hibernate.connection.url");
		
		username = env.getProperty("hibernate.connection.username");
		
		password = env.getProperty("hibernate.connection.password");
		
		driver =env.getProperty("hibernate.connection.driver_class");
		
		DriverManagerDataSource dataSource = new DriverManagerDataSource(url, username, password);
		
		
		dataSource.setDriverClassName(driver);
		
		
//		synchronized (dataSource) {
//			
//		}
		return dataSource;
	}
	
	/***
	 * 测试集合连接数据库啊集合
	 * @return
	 */
	@Bean(name="dataSourceTest")
	public DataSource dataSourceTest(){
		
		Properties pro = new Properties();//hibernate 配置属性集合对象 
		InputStream  inStream=this.getClass().getClassLoader().getResourceAsStream("configs/hibernate/hibernate-test.properties");
		try {
			pro.load(inStream);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		url = pro.getProperty("hibernate.connection.url");
		
		username = pro.getProperty("hibernate.connection.username");
		
		password = pro.getProperty("hibernate.connection.password");
		
		driver =pro.getProperty("hibernate.connection.driver_class");
		
		DriverManagerDataSource dataSource = new DriverManagerDataSource(url, username, password);
		
		dataSource.setDriverClassName(driver);

		return dataSource;
	}
	
	
	/***
	 * 设置动态数据源
	 * @param dataSource 默认入口
	 * @param targetDataSources 入口连接 集合
	 * @return
	 */
	@Bean(name = "dynamicDataSource")
	@Resource
	public DynamicDataSource dynamicDataSource(DataSource dataSource,DataSource dataSourceTest){
		Map<Object, Object> dataSources= new HashMap<Object, Object>();
		dataSources.put("dataSource", dataSource);
		/***
		 * 添加集合数据源 其他集合
		 */
		{
			dataSources.put("dataSourceTest", dataSourceTest);
		}
		DynamicDataSource dynamicDataSource= new DynamicDataSource();
		dynamicDataSource.setTargetDataSources(dataSources);
		dynamicDataSource.setDefaultTargetDataSource(dataSource);
		return dynamicDataSource;
	}
	
	@Bean(name="hibernateConfigMap")
	public Map<String, String> hibernateConfigMap(){
		Map<String,String> map= new HashMap<String,String>();
		return map;
	}
	
	/**
	 * 配置hibernate 连接池 和SessionFactory
	 * @param dataSource
	 * @return
	 */
	@Bean(name="localSessionFactoryBean")
	@Autowired
	public LocalSessionFactoryBean localSessionFactoryBean( DynamicDataSource dynamicDataSource){
		LocalSessionFactoryBean localSessionFactoryBean=new LocalSessionFactoryBean();
		localSessionFactoryBean.setDataSource(dynamicDataSource);
		
		//扫描注解 并取得 扫描到的加载bean文件路径
		WebSiteAnnotation.WebEntityScan webEntryScan = HibernateConfig.class.getAnnotation(WebSiteAnnotation.WebEntityScan.class);	
		
		Properties pro = new Properties();//hibernate 配置属性集合对象 
		InputStream  inStream=this.getClass().getClassLoader().getResourceAsStream("configs/hibernate/hibernate.properties");
		try {
			pro.load(inStream);
			localSessionFactoryBean.setHibernateProperties(pro);
		} catch (IOException e) {
			e.printStackTrace();
		}
		/**
		 * 扫描Bean路径
		 */
		 if(webEntryScan!=null&&webEntryScan.value()!=null){
			 
			String[] scanEntity = webEntryScan.value();
			
			localSessionFactoryBean.setPackagesToScan(scanEntity);
			
//			for (String str : scanStr) {
//				/***
//				 * 加载hibernate的 bean目录
//				 * 并且带有Entity 注解
//				 */
//				Set<Class<?>> setClass= ClassScaner.scan(str, Entity.class);
//				for (Class<?> class1 : setClass) {
//					//System.out.println(class1.getName());
//					localSessionFactoryBean.setAnnotatedClasses(class1);
//				}
//				
		
//			}
		 } 
		return localSessionFactoryBean;
	}
	
	
	/**
	 * 注解配置Hibernate事物管理器
	 * @param sessionFactory
	 * @return
	 */
	@Bean(name="txManager")
	@Autowired
	public HibernateTransactionManager transactionManager(SessionFactory sessionFactory){
		HibernateTransactionManager hibernateTransactionManager = new HibernateTransactionManager(sessionFactory);
		return hibernateTransactionManager;
	}
}
