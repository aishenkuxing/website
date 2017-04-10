package com.cn.website.config;

/**
 * 更改 当前本地进程 的resource
 * 线程安全
 * @author huangjiacheng
 *
 */
public class DataSourceHolder {
	//线程本地环境
    private static final ThreadLocal<String> dataSources = new ThreadLocal<String>();
    //设置数据源
    public static void setDataSource(String customerType) {
        dataSources.set(customerType);
    }
    //获取数据源
    public static String getDataSource() {
        return (String) dataSources.get();
    }
    //清除数据源
    public static void clearDataSource() {
        dataSources.remove();
    }
}
