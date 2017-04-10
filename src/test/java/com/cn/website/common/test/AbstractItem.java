package com.cn.website.common.test;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.util.Assert;

import com.mysql.jdbc.Buffer;

public abstract class AbstractItem {
	
  public void work(){
	  Assert.isTrue(false);;
  }
  
  public static void main(String[] args) throws IOException {
	  InputStreamReader sin = new InputStreamReader(System.in);  
      BufferedReader bin = new BufferedReader(sin);  
      FileWriter out = new FileWriter("myfile.txt");  
      BufferedWriter bout = new BufferedWriter(out);  
      String s;  
      while ((s = bin.readLine()).length() > 0) {  
    	  bout.write(s, 0, s.length());  
    	  bout.flush();
      }  
      bout.close();
      out.close();
      bin.close();
//	 File file =new File("E:\\输出文件.txt");
//	 System.out.println(file.exists());
//	 if(!file.exists()){
//		 try {
//			file.createNewFile();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//	 }
//	 file.deleteOnExit();
//	
//	 
//	 //输入流
//	 InputStreamReader ir = new InputStreamReader(System.in);
//	 
//	 BufferedReader br = new BufferedReader(ir);
//	 //文件输出流
//	 FileOutputStream out = new FileOutputStream(file);
//	 
//	 int b;
//	 
//	 while((b =br.read())!=-1){
//		 out.write(b);
//	 }
//	 out.close();
////	 
////	 FileWriter fw = new FileWriter(file);
////	 
////	 //输出流
////	 BufferedWriter bout = new BufferedWriter(fw);  
////	
////	 String s;
////	 while((s=br.readLine()).length()>0){
////		 bout.write(s,0,s.length());
////	 }
////	 bout.close();
//	 
//	 br.close();
//	 ir.close();
//	
	  
//	 String s=null;
//	  
//	 FileInputStream fis = new FileInputStream("D:\\我的文档\\script.sql");
//	 
//	 BufferedInputStream bis = new BufferedInputStream(fis);
//
//	 int r = 512;
//	 byte[] buffer = new byte[r];
//	 while(fis.read(buffer,0,r)!=-1){
//		 System.out.println(new String(buffer));
//	 }
//	 fis.close();
	 
	 
//	 String s=null;
//	 InputStreamReader ir = new InputStreamReader(System.in);  
//     BufferedReader in = new BufferedReader(ir); 
//     s = in.readLine();  
//     while (s != null) {  
//         System.out.println("Read: " + s);  
//         s = in.readLine();  
//     }  
//     // 关闭缓冲阅读器  
//     in.close();
  }
}
