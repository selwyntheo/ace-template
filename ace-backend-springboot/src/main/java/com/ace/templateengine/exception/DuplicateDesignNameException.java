package com.ace.templateengine.exception;

public class DuplicateDesignNameException extends RuntimeException {
    public DuplicateDesignNameException(String message) {
        super(message);
    }
    
    public DuplicateDesignNameException(String message, Throwable cause) {
        super(message, cause);
    }
}
