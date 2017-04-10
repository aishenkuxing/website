package com.cn.website.aspect;


import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.cn.website.aware.WebContextUtil;
import com.cn.website.aware.WebSiteBeanWare;
import com.cn.website.common.auth.TransactionAuth;
import com.cn.website.common.service.HomeService;
import com.cn.website.common.service.impl.HomeServiceImpl2;

@Aspect
@Configuration
public class WebSiteAspect {
/*	@Autowired
	@Qualifier("sessionFactory")
	private SessionFactory sessionFactory;*/
	
//	@Autowired
//	public HibernateTransactionManager txManager;
	
//	@Autowired
//	@Qualifier("homeServiceImpl2")
//	private HomeService  homeServiceImpl2;
//	
	/**
	 * <aop:aspect>
	 * @Transactional 事务拦截处理
	 * @param ex
	 */
	@Pointcut("execution(* com.cn.website.*.service.impl..*(..))")// the pointcut expression
	@Transactional(readOnly = true, propagation = Propagation.REQUIRES_NEW)
	private void PointCutService() {
		//System.out.println("PointCutService");		
	}// the pointcut signature
	
	/**
	 * <aop:advisor>
	 */
	@Before("PointCutService()&&@annotation(transactionType)")
	private void before(TransactionAuth transactionType) {
		//Session session= sessionFactory.getCurrentSession();
//		System.out.println(transactionType.value());
//		System.out.println("运行中...");
	}
	
	/**
	 * <aop:advisor>
	 * @param ex
	 */
	@AfterThrowing(
	pointcut="PointCutService()",
	throwing="ex")
	public void doRecoveryActions(Exception ex) {
		System.out.println("异常时执行！");
	// ...
	}
	
	/**
	 * <aop:advisor>
	 */
	@AfterReturning(pointcut="PointCutService()",returning="retVal")
	public void doAccessCheck(Object retVal) {
		System.out.println("方法体运行结束...");
	// ...
	}
	/**
	 * 对最终值进行更改
	 * @param pjp
	 * @return
	 * @throws Throwable
	 */
	@Around("PointCutService()")
	public Object doBasicProfiling(ProceedingJoinPoint pjp) throws Throwable {
		//System.out.println((HomeService)WebSiteBeanWare.getBean("homeServiceImpl2"));
		Object returnValue = null;
		try {
//			/**
//			 * 拦截判断 执行
//			 */
//			if("com.cn.website.common.service.impl.HomeServiceImpl".equals(pjp.getTarget().getClass().getName())){
//				returnValue = homeServiceImpl2.getVersion();
//			}else{
//				returnValue = pjp.proceed();
//			}
			
			returnValue = pjp.proceed();
		}catch(Exception e){
			e.printStackTrace();
		}finally {
			
		}
		return returnValue;
	}
	
}
