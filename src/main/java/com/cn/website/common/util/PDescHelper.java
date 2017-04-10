/* =============================================================
 * Created: [2016年3月22日] by wanghuan
 * =============================================================
 *
 * Copyright 2014-2015 NetDragon Websoft Inc. All Rights Reserved
 *
 * =============================================================
 */

package com.cn.website.common.util;

import java.security.MessageDigest;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.IvParameterSpec;

/**
 * @author huangjiacheng
 * @since
 */
public class PDescHelper {

    /**
     * ERP系统加密方法(专用)
     * 
     * @param message 明文
     * @return 密文
     */
    public static String encrypt(String message) throws Exception {

        String key = "$[f,3/fg";
        
        Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding");
        DESKeySpec desKeySpec = new DESKeySpec(key.getBytes("UTF-8"));
        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
        SecretKey secretKey = keyFactory.generateSecret(desKeySpec);
        IvParameterSpec iv = new IvParameterSpec(key.getBytes("UTF-8"));
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);

        byte[] bytesrc = cipher.doFinal(message.getBytes("UTF-8"));
        return StrHelper.toHexString(bytesrc);
    }

    /**
     * ERP系统解密方法(专用)
     * 
     * @param message 密文
     * @return 明文
     */
    public static String decrypt(String message) throws Exception {

        String key = "$[f,3/fg";

        byte[] bytesrc = StrHelper.convertHexString(message);
        Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding");
        DESKeySpec desKeySpec = new DESKeySpec(key.getBytes("UTF-8"));
        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
        SecretKey secretKey = keyFactory.generateSecret(desKeySpec);
        IvParameterSpec iv = new IvParameterSpec(key.getBytes("UTF-8"));

        cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);

        byte[] retByte = cipher.doFinal(bytesrc);
        return new String(retByte);
    }

    /**
     * ERP系统登录密码MD5加密(专用)
     * 
     * @param message明文
     * @return 密文
     */
    public static String ERP_MD5encrypt(String message) throws Exception {

        String pwd = message + "\uff0c\u3002fdjf,jkgfkl";
        MessageDigest digest = MessageDigest.getInstance("MD5");
        digest.update(pwd.getBytes("GB2312"));
        byte messageDigest[] = digest.digest();

        return StrHelper.toHexString(messageDigest);
    }

    /**
     * MD5加密
     * 
     * @param message明文
     * @return 密文
     */
    public static String MD5encrypt(String message) throws Exception {

        MessageDigest digest = MessageDigest.getInstance("MD5");
        digest.update(message.getBytes());
        byte messageDigest[] = digest.digest();

        return StrHelper.toHexString(messageDigest);
    }

}
