package com.cn.website.common.entity;

/**
 * @author huangjiacheng
 * return message
 * @since
 */
public class MessageNotice {
    private Integer code;
    private String message;
    private String errorMessage;
    public MessageNotice(){
    	
    }
    /**
     * 
     * @param code 
     * @param message  code >=1 :message  else errorMessage
     */
    public MessageNotice(Integer code,String message){
    	this.code = code;
    	if( code >= 1 ){
    		this.message = message;
    	}else{
    		this.errorMessage = message;
    	}
    }
    /**
     * @return the code
     */
    public Integer getCode() {
        return code;
    }

    /**
     * @param code the code to set
     */
    public void setCode(Integer code) {
        this.code = code;
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the errorMessage
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * @param errorMessage the errorMessage to set
     */
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

}
