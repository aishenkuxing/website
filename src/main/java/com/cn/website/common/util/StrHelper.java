package com.cn.website.common.util;

/***
 * @author huangjiacheng
 */
public class StrHelper {
	/**
     * 将字符串转成十六进制字节数组
     * @param str String 字符串
     * @return
     */
    public static byte[] convertHexString(String str) {

        byte digest[] = new byte[str.length() / 2];

        for (int i = 0; i < digest.length; i++) {
            String byteString = str.substring(2 * i, 2 * i + 2);
            int byteValue = Integer.parseInt(byteString, 16);
            digest[i] = (byte) byteValue;
        }

        return digest;
    }
    

    /**
     * 将十六进制字节数组转成字符串
     * 
     * @param b byte[] 字节数组
     * @return
     */
    public static String toHexString(byte b[]) {

        StringBuffer hexString = new StringBuffer();

        for (int i = 0; i < b.length; i++) {
            String plainText = Integer.toHexString(0xff & b[i]);

            if (plainText.length() < 2)
                plainText = "0" + plainText;

            hexString.append(plainText);
        }

        return hexString.toString();
    }
    
    public static void main(String[] args) {
		//System.out.println(StrHelper.toHexString('[B@6d9c638'));
	}
}
