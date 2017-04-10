package com.cn.hadoop;

import java.io.IOException;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;


public class MaxTemperature {

	public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
//		System.out.println(args.length);
//		if(args.length!=2){
//			System.err.println("args 长度有误！");
//			System.exit(-1);
//		}
		Job job = new Job();
		job.setJarByClass(MaxTemperature.class);
		job.setJobName("Max Temperature");
		
		FileInputFormat.addInputPaths(job, "D:\\test\\hadoop\\test.txt");
		FileOutputFormat.setOutputPath(job, new Path("D:\\test\\hadoop\\output"));
		
		job.setReducerClass(MaxTemeratureReducer.class);
		job.setMapperClass(MaxTemperatureMapper.class);
		
		job.setOutputKeyClass(Text.class);
		job.setMapOutputValueClass(IntWritable.class);
		
		System.exit(job.waitForCompletion(true)?0:1);
		
		
	}

}
