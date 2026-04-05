package com.example.campus_hub_backend.exception;

public class DuplicateResourceCodeException extends RuntimeException {
    public DuplicateResourceCodeException(String message) {
        super(message);
    }
}
