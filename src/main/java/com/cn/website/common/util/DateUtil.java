package com.cn.website.common.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 日期检测工具
 * @author Administrator
 *
 */
public class DateUtil {
	
	 /**
     * 计算两个日期之间相差的天数
     * 
     * @param begDate 较小的时间
     * @param endDate 较大的时间
     * @return 相差天数
     * @throws ParseException
     */
    public static int daysBetween(Date begDate, Date endDate) throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        begDate = sdf.parse(sdf.format(begDate));
        endDate = sdf.parse(sdf.format(endDate));
        Calendar cal = Calendar.getInstance();
        cal.setTime(begDate);
        long time1 = cal.getTimeInMillis();
        cal.setTime(endDate);
        long time2 = cal.getTimeInMillis();
        long between_days = (time2 - time1) / (1000 * 3600 * 24);

        return Integer.parseInt(String.valueOf(between_days));
    }
    
    /**
     * 计算输入日期减去相应天数或月份后的日期
     * 
     * @param inDate 输入的日期
     * @param nu 减去的天数或月份
     * @param type 1:天;2:月
     * @return 返回的日期
     */
    public static Date calDate(Date inDate, int nu, int type) {

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(inDate);
        if (type == 1) {
            calendar.add(Calendar.DATE, nu);
        } else if (type == 2) {
            calendar.add(Calendar.MONTH, nu);
        }

        Date outDate = calendar.getTime();

        return outDate;
    }
}
