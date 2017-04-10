package dynamic.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class MyInvocationHandler implements InvocationHandler{
	/** 
     * 执行目标对象的方法 
     */  
	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
	     
        // 在目标对象的方法执行之前简单的打印一下  
        System.out.println("------------------before------------------");  
          
        // 执行目标对象的方法  
        Object result = method.invoke(target, args);  
          
        // 在目标对象的方法执行之后简单的打印一下  
        System.out.println("-------------------after------------------");  
          
        return result;  
	}
	
	// 目标对象   
    private Object target;  
      
    /** 
     * 构造方法 
     * @param target 目标对象  
     */  
    public MyInvocationHandler(Object target) {  
        super();  
        this.target = target;  
    }  
  
  
  
    /** 
     * 获取目标对象的代理对象 
     * @return 代理对象 
     */  
    public Object getProxy() {  
        return Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(),   
                target.getClass().getInterfaces(), this);  
    }  
    
    public static void main(String[] args) {
    	UserService userService=new  UserServiceImpl();
    	userService.setName(2);
    	MyInvocationHandler invocationHandler = new MyInvocationHandler(userService);
    	UserService userService1 = (UserService) invocationHandler.getProxy();
    	System.out.println(userService.getName());
    	System.out.println(userService1.getName());
//    	UserService userService2 = userService;
//    	userService1.setName(3);
//    	//userService=null;
//    	System.out.println(userService);
//    	System.out.println(userService1);
//    	System.out.println(userService2);
    	
	}
   
}

