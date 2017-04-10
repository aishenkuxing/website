package com.cn.website.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static springfox.documentation.builders.PathSelectors.regex;

@Configuration
@EnableSwagger2 
@PropertySources(value = { @PropertySource(value = { "classpath:configs/swagger/swagger-config.properties" }) })
public class SwaggerConfig {
	
	 @Autowired
	 private Environment propertyResolver;
	 /**
     * Project Name
     */
	    public static String PROJECT_NAME;
	

	 /** 
	    * Every Docket bean is picked up by the swagger-mvc framework - allowing for multiple 
	    * swagger groups i.e. same code base multiple swagger resource listings. 
	    */  
	    @Bean
	    public Docket api() { 
	        return new Docket(DocumentationType.SWAGGER_2)  
	          .select()  
	          /**
	      	 * 拦截的api路径
	      	 */
	          .paths(regex(propertyResolver.getProperty("swagger.url")))     
	          .build().apiInfo(apiInfo()); 
	                                    
	    }
	    
	    @SuppressWarnings("deprecation")
		private ApiInfo apiInfo() {
	        ApiInfo apiInfo = new ApiInfo(
        		 propertyResolver.getProperty("swagger.title"),
                 propertyResolver.getProperty("swagger.description"),
                 propertyResolver.getProperty("swagger.version"),
                 propertyResolver.getProperty("swagger.termsOfServiceUrl"),
                 propertyResolver.getProperty("swagger.contact"),
                 propertyResolver.getProperty("swagger.license"),
                 propertyResolver.getProperty("swagger.licenseUrl")
                 );
	        return apiInfo;
	    }
  
}
