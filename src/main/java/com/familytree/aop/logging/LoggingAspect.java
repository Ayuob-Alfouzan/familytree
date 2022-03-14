package com.familytree.aop.logging;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.familytree.config.Constants;
import com.familytree.security.SecurityUtils;
import java.util.Arrays;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.env.Environment;

/**
 * Aspect for logging execution of service and repository Spring components.
 *
 * By default, it only runs with the "dev" profile.
 */
@Aspect
public class LoggingAspect {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private final Environment env;

    public LoggingAspect(Environment env) {
        this.env = env;
    }

    /**
     * Pointcut that matches all rest endpoints.
     */
    @Pointcut("within(com.familytree.web.rest.resource..*)")
    public void applicationRestPointcut() {
        // Method is empty as this is just a Pointcut, the implementations are in the advices.
    }

    /**
     * Advice that logs when a method is entered and exited.
     *
     * @param joinPoint join point for advice.
     * @return result.
     * @throws Throwable throws {@link IllegalArgumentException}.
     */
    @Around("applicationRestPointcut()")
    public Object logAroundRest(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            MDC.put(Constants.USERNAME_KEY, SecurityUtils.getCurrentUserEmail().orElse(""));
            MDC.put(Constants.TRANSACTION_ID_KEY, NanoIdUtils.randomNanoId());
            log.info(
                "Enter: {}.{}() with argument[s] = {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs())
            );
            Object result = joinPoint.proceed();
            log.info(
                "Success: {}.{}() with result = {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                result
            );
            return result;
        } catch (Exception e) {
            log.error(
                "Failure: {}.{}() with cause = {}, message = {} and exception ",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                e.getCause() != null ? e.getCause() : "'NULL'",
                "'" + e.getMessage() + "'",
                e
            );
            throw e;
        }
    }

    /**
     * Advice that logs when an exception is handled.
     *
     * @param retVal result of the Exception Handler method
     * @return result
     * @throws Throwable throws IllegalArgumentException
     */
    @AfterReturning(pointcut = "execution(* com.familytree.web.rest.errors.**.*(..))", returning = "retVal")
    public void logAfterExceptionHandling(Object retVal) throws Throwable {
        log.debug("Exception handled: {}", retVal);
    }
}
