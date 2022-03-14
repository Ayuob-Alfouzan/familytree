package com.familytree.service.util.exception;

import java.net.URI;
import org.zalando.problem.AbstractThrowableProblem;

public class BadRequestException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;

    private final String errorKey;

    public BadRequestException(String errorKey) {
        this(ErrorConstants.DEFAULT_TYPE, errorKey);
    }

    public BadRequestException(URI type, String errorKey) {
        super(type);
        this.errorKey = errorKey;
    }

    public String getErrorKey() {
        return errorKey;
    }

    @Override
    public String toString() {
        return "BadRequestException{" + "errorKey='" + errorKey + '\'' + '}';
    }
}
