package com.cn.website.test.thread;

public class MyThread1 extends Thread {

	@Override
	public void run() {
		try {
			this.sleep(1000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("MyThread.");
	}
	public static void main(String[] args) throws InterruptedException {
		MyThread1 t = new MyThread1();
		t.start();
		System.out.println(t.isAlive());
		t.sleep(10000);
		System.out.print("one. ");
		t.run();
		System.out.print("two. ");
		t.stop();
	}

	
}
