package com.cn.website.event.test;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.Supplier;

public class Test {

	interface MathOperation {
		int operation(int a, int b);
	}

	public static <T> T create(final Supplier<T> supplier) {
		return supplier.get();
	}

	// lambda表达式 传入方法
	public static <T, D> D runtime(Function<Map, D> function) throws Exception {
		Map map = new HashMap<>();
		map.put("key", "value");
		return function.apply(map);
	}

	public static <T, D> D runConsumer(BiConsumer<T, D> biConsumer) {
		return null;
	}

	public static void main(String[] args) throws Exception {

		Integer a1 = new Integer(1);
		Integer b1 = new Integer(2);
		System.out.println(a1 == b1);// false

		Integer c1 = 1;
		Integer d1 = 1;
		
		System.out.println(c1==d1);// true
	

		int arg[] = { 1, 2, 3 };
		// char a = 66;
		// System.out.println(a + "");
		// System.out.println(Character.toString(a));
		Callable<String> c = () -> "done";
		int x = 2;

		Test test = Test.create(Test::new);

		System.out.println(test);

		System.out.println(test.clone().getClass());

		Test.MathOperation addition = (int a, int b) -> {
			return a + b;
		};

		System.out.println(test.runtime((map) -> {
			return map.get("key");
		}));

		//System.out.println(addition.operation(3, 4));

		// (int x, int y) ->{x + y};

		// Callable<Integer> callable = 1==1 ? (() -> 23) : (() -> 42);
		//
		// System.out.println(callable.call()+1);

	}

}