package com.ace.templateengine.exception;

public class ProjectAccessDeniedException extends RuntimeException {
    public ProjectAccessDeniedException(String message) {
        super(message);
    }
    
    public ProjectAccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}