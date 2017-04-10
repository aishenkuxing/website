package com.cn.website.test.thread;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class MyThead   {
	public static List list = Collections.synchronizedList(new ArrayList<Map<String,Object>>());;

	class MyThread1 extends Thread {
		@Override
        public void run() {
            for (int i = 1; i <= 10; i++) {
            	list.add("线程1第" + i + "次执行！");
            }
        }
    }
	
	 class MyRunnable implements Runnable {
		 	@Override
	        public void run() {
	            for (int i = 1; i <= 10; i++) {
	            	list.add("线程2第" + i + "次执行！");
	            }
	        }
	    }

	public static void main(String[] args) {
		MyThead threadYield = new MyThead();
        Thread t1 = threadYield.new MyThread1();
        Thread t2 = new Thread(threadYield.new MyRunnable());
        t1.start();
        t2.start();
        for (int i = 1; i <= 20; i++) {
        	list.add("主线线" + i + "次执行！");
            if (i > 2)
                try {
                    // t1线程合并到主线程中，主线程停止执行过程，转而执行t1线程，直到t1执行完毕后继续。
                    t1.join();
                    t2.join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
        }
        
        for (Object key : list) {
			System.out.println(key);
		}
        
	}
}
