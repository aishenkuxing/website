package com.cn.website.aspect;


import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.annotation.Configuration;
import com.cn.website.common.auth.TransactionAuth;

/***
 * dao拦截
 * @author Administrator
 *
 */
public class WebSiteDaoAspect {
	
	/**
	 * <aop:aspect>
	 * @Transactional 事务拦截处理
	 * @param ex
	 */
	@Pointcut("execution(* com.cn.website.*.dao.impl..*(..))")// the pointcut expression
	private void PointCutDao() {
		//System.out.println("PointCutService");		
	}
	
	/**
	 * <aop:advisor>
	 */
	@Before("PointCutDao()")
	private void before(TransactionAuth transactionType) {

	}
	
	/**
	 * <aop:advisor>
	 * @param ex
	 */
	@AfterThrowing(
	pointcut="PointCutDao()",
	throwing="ex")
	public void doRecoveryActions(Exception ex) {
		System.out.println("异常时执行！");
	// ...
	}
	
	/**
	 * <aop:advisor>
	 */
	@AfterReturning(pointcut="PointCutDao()",returning="retVal")
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
	@Around("PointCutDao()")
	public Object doBasicProfiling(ProceedingJoinPoint pjp) throws Throwable {
		Object returnValue = null;
		try {
			returnValue = pjp.proceed();
		}catch(Exception e){
			e.printStackTrace();
		}finally {
			
		}
		return returnValue;
	}
	
}
