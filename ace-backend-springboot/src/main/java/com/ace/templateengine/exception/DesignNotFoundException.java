package com.ace.templateengine.exception;

public class DesignNotFoundException extends RuntimeException {
    public DesignNotFoundException(String message) {
        super(message);
    }
    
    public DesignNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
