package com.cn.website.common.test;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang.StringEscapeUtils;
import org.hibernate.SessionFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.util.AlternativeJdkIdGenerator;
import org.springframework.util.Assert;

import com.cn.website.config.WebSiteConfig;
import com.cn.website.entry.Event;

public class MyTestMain  {
    public static int getSum(int sum , int num){
    	return sum + num;
    }
    
    public static Object getFun(int obj,Function<Object, Object> fun) {
		return fun.apply(obj);
	}

	public static void main(String[] args) {
		//��ȡuuid
//		AlternativeJdkIdGenerator gen= new AlternativeJdkIdGenerator();
//		System.out.println(gen.generateId());
		System.out.println(Charset.forName("UTF-8"));
		System.out.println(APITest.i);
		// Assert.isTrue(false,"����Ϊtrue����");;
//		APITest api=new APITestImpl(){
//		  public void getName(Function<String, String> func){
//			  
//		  } 
//		};
//		api.getTestApi();
		
		
		List<Event> evList=new ArrayList<>();
		Event event=new Event();
		event.setTitle("中国风");
		evList.add(event);
	
		evList=evList.stream().map((ev)->{
			System.out.println(ev.getTitle());
			ev.setTitle("日本");
			return ev;
		}).filter((ev)->{
			System.out.println(ev.getTitle());
			return true;
		}).distinct().collect(Collectors.toList());;
		
		//System.out.println(evList.size());
		
		
		List<Integer> ints =  Arrays.asList(1,2,3,4,7,8,5,6,9,10);
		
		System.out.println("ints sum is:" + ints.stream().reduce(0, (sum, item) -> getSum(sum, item) ));
		
		///返回 r表达式 true 则返回true
		System.out.println(ints.stream().noneMatch(item -> item < 8));
		
		System.out.println(ints.stream().anyMatch(item -> item < 8));

		System.out.println(ints.stream().map((i)->{
			return i;
			}).sorted((a,b)->{
			return a.compareTo(b);
		}).collect(Collectors.toList()));
		
		///String 为传入参数,Integer为返回参数
		Function<String, Integer> toInteger = val->{return event.hashCode();};
		
		getFun(111,val->{
			System.out.println(val);
			return 100;
		});
		
		//toInteger.
	
		int i=10<<2;
		
		//Function<String, String> backToString = toInteger.andThen(String::valueOf);
		
		//System.out.println(toInteger.apply("123"));
		
		//Supplier<Event> ev = Event::new;
		//System.out.println(ev.getClass());   // new Person
		
		Map<String,Object> map= new HashMap<String,Object>();
		
		map.put("val", 1);
		
		map.put("val1", 2);
		
		
		map.forEach((id, val) -> {
			System.out.println(val);
		});
		//防止注入方法
		
		String str = StringEscapeUtils.escapeSql("'");
		System.out.println(str);

		//System.out.println(".md".compareTo("am"));
//	
		//Stream<Integer> integerStream = Stream.of(1, 2, 3, 5);

//		List<Boolean> lowercaseNames = integerStream.map((Integer a)->{
//			return a>3;
//		}).collect(Collectors.toList());
		
//		System.out.println(integerStream.filter((a)->{
//			return a>3;
//		}).count());
		
		
		
		//List<String> lowercaseNames = names.stream().map((String name) -> {return name.toLowerCase();}).collect(Collectors.toList());
		
		
	   
	   
	}

}
