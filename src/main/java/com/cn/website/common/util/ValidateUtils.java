/* =============================================================
 * Created: [2016年3月21日] by Administrator
 * =============================================================
 *
 * Copyright 2014-2015 NetDragon Websoft Inc. All Rights Reserved
 *
 * =============================================================
 */

package com.cn.website.common.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author huangjiacheng
 * @since
 */
public class ValidateUtils {

    /**
     * 验证邮箱
     * 
     * @param email
     * @return
     */

    public static boolean checkEmail(String email) {
        boolean flag = false;
        try {
            String check = "^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
            Pattern regex = Pattern.compile(check);
            Matcher matcher = regex.matcher(email);
            flag = matcher.matches();
        } catch (Exception e) {
            flag = false;
        }
        return flag;

    }

    /**
     * 验证手机号码
     * 
     * @param mobiles
     * @return
     */

    public static boolean checkMobile(String mobile) {
        boolean flag = false;
        try {
            Pattern check = Pattern.compile("^1(3|4|5|7|8)\\d{9}$");
            Matcher matcher = check.matcher(mobile);
            flag = matcher.matches();
        } catch (Exception e) {
            flag = false;
        }
        return flag;
    }

    /**
     * 电话号码验证
     * 
     * @param str
     * @return 验证通过返回true
     */
    public static boolean checkFixPhone(String str) {
        Pattern p1 = null, p2 = null;
        Matcher m = null;
        boolean b = false;
        p1 = Pattern.compile("^[0][1-9]{2,3}-[0-9]{5,10}$"); // 验证带区号的
        p2 = Pattern.compile("^[1-9]{1}[0-9]{5,8}$"); // 验证没有区号的
        if (str.length() > 9) {
            m = p1.matcher(str);
            b = m.matches();
        } else {
            m = p2.matcher(str);
            b = m.matches();
        }
        return b;
    }

    /**
     * 判断是否是数字
     * 
     * @param QQ
     * @return
     */
    public static boolean isNumeric(String str) {
        Pattern pattern = Pattern.compile("[0-9]*");
        Matcher isNum = pattern.matcher(str);
        if (!isNum.matches()) {
            return false;
        }
        return true;
    }
}
