package com.cn.website.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.velocity.VelocityViewResolver;
import org.springframework.web.util.UrlPathHelper;

import com.cn.website.advise.support.WebSiteAdvisedSupport;
import com.cn.website.aspect.WebSiteDaoAspect;
import com.cn.website.config.hibernateconfig.HibernateConfig;
import com.cn.website.interceptor.WebSiteLocaleInterceptor;
import com.cn.website.interceptor.WebSiteSecurityInterceptor;
/**
 * 加载配置项
 * EnableWebMvc :<mvc:annotation-driven/> 加载注解驱动
 * @EnableAspectJAutoProxy:开启切面代理
 * @EnableTransactionManagement:开启全局事务注解
 * @author huangjiacheng
 *
 */
import com.cn.website.namegenerator.WebSiteNameGenerator;
@Configuration
@EnableWebMvc
@ActiveProfiles("dev")
@EnableTransactionManagement
@Import({TestAppConfig.class,DataAppConfig.class,HibernateConfig.class,SwaggerConfig.class})
@ComponentScan(basePackages = {
	"com.cn.website.aware",
	"com.cn.website.*.controller",
	"com.cn.website.*.api.controller",
	"com.cn.website.*.service.impl",
	"com.cn.website.*.dao.impl",
	"com.cn.website.aspect",
	"com.cn.website.interceptor"
},nameGenerator = WebSiteNameGenerator.class)
@EnableAspectJAutoProxy
@PropertySources(value = { @PropertySource(value = { "classpath:configs/applicationContext.properties" }) })
public class WebSiteConfig extends WebMvcConfigurerAdapter {
	 @Autowired
	 private Environment env;
	 
//	 @InitBinder
//	 public void onStartup(){
//		 System.out.println("onStartup");
//	 }
//	 
	 @Override
	 public void addFormatters(FormatterRegistry registry) {
		 System.out.println("addFormatters");
	 }
	 
	 /**
	  * 添加跨域请求全局配置
	  */
	 @Override
	 public void addCorsMappings(CorsRegistry registry) {
		 registry.addMapping("/api/**")
		 //.allowedOrigins("http://domain2.com")
		 .allowedMethods("PUT", "DELETE","GET","POST")
//		 .allowedHeaders("header1", "header2", "header3")
//		 .exposedHeaders("header1", "header2")
		 .allowCredentials(false).maxAge(3600);
	 }
	 /**
	  * 配置后缀名 渲染不同 头部信息
	  */
	 @Override
	 public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
		 configurer.mediaType("json", MediaType.APPLICATION_JSON_UTF8);
		 configurer.mediaType("xml", MediaType.APPLICATION_XML);
		 configurer.mediaType("upload", MediaType.MULTIPART_FORM_DATA);
	 }
	 
	 /**
	  * 添加拦截器拦截
	  */
	 @Override
	 public void addInterceptors(InterceptorRegistry registry) {
		 //registry.addInterceptor(interceptor)
		 /**
		  * 普通路径拦截  剔除swagger的拦截
		  */
		 registry.addInterceptor(new WebSiteLocaleInterceptor()).excludePathPatterns("/swagger");
		 //registry.addInterceptor(new ThemeInterceptor()).addPathPatterns("/**").excludePathPatterns("/admin/**");
		 /***
		  * 认证路径拦截
		  */
		 registry.addInterceptor(new WebSiteSecurityInterceptor()).addPathPatterns("/secure/*");
	 }
	 
//	 @Bean
//	 public FreeMarkerConfigurer freeMarkerConfigurer() {
//		 FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
//		 //configurer.setTemplateLoaderPath("/WEB-INF/");
//		 return configurer;
//	 }
	 /**
	  * 配置视图拦截重定向规则
	  */
	 @Override
	 public void addViewControllers(ViewControllerRegistry registry) {
		 //如果当前路径为'/',则自动跳转到 home/index
		 registry.addViewController("/").setViewName("/swagger/");
		// registry.addViewController("/**").setViewName("home/index");
	 }
	 /**
	  * 配置视图解决方案
	  */
	 @Override
	 public void configureViewResolvers(ViewResolverRegistry registry) {
//		 registry.enableContentNegotiation(new MappingJackson2JsonView());
		 /**
		  * 默认Prefix == "/WEB-INF/"
		  * 注册 jsp拦截方式 
		  */
		 //registry.viewResolver(internalResourceViewResolver());
		 // registry.jsp("/WEB-INF/pages/",".jsp");
		 // registry.viewResolver(internalResourceViewResolver());
		// registry.viewResolver(internalResourceViewResolver2());
		 /**
		  * vm结尾的模板方案
		  */
		 //registry.viewResolver(viewResolver());
		 /**
		  * 系统默认的模板方式
		  */
//		 registry.freeMarker();
//		 registry.groovy();
	 }
	 /**
	  * 默认：jsp视图解决方案 织入
	  * */
	@Bean(name="internalResourceViewResolver")
    public InternalResourceViewResolver internalResourceViewResolver() {
		//正式拦截地址
        InternalResourceViewResolver internalResourceViewResolver = new InternalResourceViewResolver();
        internalResourceViewResolver.setPrefix(env.getProperty("application.page"));
        internalResourceViewResolver.setSuffix(".jsp");
        internalResourceViewResolver.setOrder(1);
        //添加jstl标签包
        internalResourceViewResolver.setViewClass(JstlView.class);
        return internalResourceViewResolver;
    }

 
	/**
	 * 设置Velocity视图规则 织入
	 * @return
	 */
	@Bean(name="velocityViewResolver")
	public VelocityViewResolver velocityViewResolver(){
		VelocityViewResolver viewResolver=new VelocityViewResolver();
		viewResolver.setPrefix("/WEB-INF/pages/");
		viewResolver.setSuffix(".vm");
//		viewResolver.setCache(true);
//		viewResolver.setCacheLimit(AbstractCachingViewResolver.DEFAULT_CACHE_LIMIT);
		//velocityView 配置方案
		//viewResolver.setToolboxConfigLocation("/WEB-INF/toolbox.xml");
		return viewResolver;
	}

	
//	@Bean(name ="velocityConfig")
//	public VelocityConfigurer setVelocityConfigurer(){
//		VelocityConfigurer configurer=new VelocityConfigurer();
//		//configurer.setVelocityEngine(velocityEngine);
//		return configurer;
//	}
	
	 /**
	  * spring 配置静态文件 spring自带的serverlet拦截匹配静态
	  * 
	  */
	 @Override
	 public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		  //configurer.enable();
	 }
	 
	 /**
	  * 配置拦截规则
	  * <mvc:path-matching
			suffix-pattern="true"
			trailing-slash="false"
			registered-suffixes-only="true"
			path-helper="pathHelper"
			path-matcher="pathMatcher"/>
	  */
	 @Override
	 public void configurePathMatch(PathMatchConfigurer configurer) {
		 configurer
		 .setUseSuffixPatternMatch(true)
		 .setUseTrailingSlashMatch(true)
		 .setUseRegisteredSuffixPatternMatch(false);
	 }
	 /**
	  * pathHelper 注入
	  * @return
	  */
	 @Bean
	 public UrlPathHelper urlPathHelper() {
		 UrlPathHelper urlPathHelper=new UrlPathHelper();
		 /**
		  * 设置默认拦截URI的编码格式
		  */
		 urlPathHelper.setDefaultEncoding(env.getProperty("application.encoding"));
		 return urlPathHelper;
	 }
	 
	 @Bean
	 public PathMatcher antPathMatcher() {
		PathMatcher pathMatcher= new AntPathMatcher();
		//pathMatcher.isPattern("/api");
		//pathMatcher.extractPathWithinPattern(pattern, path)
	   return pathMatcher;
	 }
	 
	 /**
	  * 配置静态资源拦截器
	  */
	 @Override
	 public void addResourceHandlers(ResourceHandlerRegistry registry) {
		 System.out.println("当前版本号:"+env.getProperty("application.version"));
		 
		 /**
		  * setCachePeriod 设置过期时间为1年 毫秒为单位
		  * <mvc:resources mapping="/resources/**" location="/WEB-INF/resources/"/>
		  * resources的资源必须放在 WEB-INF下   resources---->WEB-INF/resources
		  * 
		  */
		 registry.addResourceHandler("/resources/**").addResourceLocations(env.getProperty("application.resources")).setCachePeriod(31556926);
		 
		 registry.addResourceHandler("/swagger/**").addResourceLocations(env.getProperty("application.swagger")).setCachePeriod(31556926);
		// registry.addResourceHandler("/swagger/**.html").addResourceLocations("/WEB-INF/swagger/").setCachePeriod(31556926);
		 
		 /**
		  * 设置平台信息
		  * <mvc:resources mapping="/resources/**" location="/, classpath:/META-INF/public-web-resources/"/>
		  */
		 registry.addResourceHandler("/publicWebResources/**")
		 .addResourceLocations("/", "classpath:/META-INF/public-web-resources/");
		 
		 /**
		  * js缓存策略
		  */
//		 registry.addResourceHandler("/resources/**").addResourceLocations("/WEB-INF/resources/").resourceChain(true).addResolver(  
//		            new VersionResourceResolver().addFixedVersionStrategy("1.10", "/**/*.js").addContentVersionStrategy("/**"));
	 }
	 
}
