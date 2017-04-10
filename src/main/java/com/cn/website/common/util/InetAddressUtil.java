package com.cn.website.common.util;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

/**
 * @author huangjiacheng
 * @since
 */
public class InetAddressUtil {

    public static List<InetAddress> getDeviceIP() throws Exception {
        List<InetAddress> list = new ArrayList<InetAddress>();
        Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();
        while (networkInterfaces.hasMoreElements()) {
            Enumeration<InetAddress> inetAddresses = networkInterfaces.nextElement().getInetAddresses();
            while (inetAddresses.hasMoreElements()) {
                list.add(inetAddresses.nextElement());
            }
        }
        return list;
    }

    public static void main(String[] args) {
        try {
            System.out.println(InetAddressUtil.getDeviceIP());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
