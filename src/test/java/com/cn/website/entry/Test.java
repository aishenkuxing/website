package com.cn.website.entry;

import javax.persistence.Entity;

import org.hibernate.type.*;

@Entity(name = "test")
public class Test<T> {
   private long id;
   
   private StringType name;
   
   private BooleanType booleanType;
   
   private NumericBooleanType numericBooleanType;
   
   private TextType textType;
   
   public T t;
   
   public String getClassName(){ 
	 return  t.toString();
   }
   
   public static void main(String[] args) {
//	   Test tt=new Test<String>();
//	   System.out.println(tt.getClassName());
   }
   
   //private MaterializedClob materializedClob;
}
