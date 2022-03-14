package com.familytree.config;

import com.familytree.service.util.FilterUtil;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.springframework.web.filter.GenericFilterBean;

public class XSSFilter extends GenericFilterBean {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        FilterUtil.BufferedRequestWrapper requestWrapper = new FilterUtil.BufferedRequestWrapper((HttpServletRequest) request);
        String body = requestWrapper.getRequestBody();

        String cleaned = Jsoup.clean(body, Whitelist.none());

        // rewrite the body to the cleaned input
        requestWrapper.resetInputStream(cleaned.getBytes());

        chain.doFilter(requestWrapper, response);
    }
}
