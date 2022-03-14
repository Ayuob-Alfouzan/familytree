package com.familytree.service.util;

import java.io.*;
import java.nio.charset.StandardCharsets;
import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

/**
 * Set of utils to be used with
 * @see javax.servlet.Filter
 */
public class FilterUtil {

    private FilterUtil() {}

    /**
     * Http response wrapper used to change response body.
     * @see HttpServletRequestWrapper
     */
    public static class ResponseWrapper extends HttpServletResponseWrapper {

        private HttpServletResponse response;
        private CopyPrintWriter writer;

        public ResponseWrapper(HttpServletResponse response) {
            super(response);
            this.response = response;
            try {
                writer = new CopyPrintWriter(response.getWriter());
            } catch (IOException e) {
                e.printStackTrace();
                writer = new CopyPrintWriter(new CharArrayWriter());
            }
        }

        @Override
        public PrintWriter getWriter() {
            return writer;
        }

        /**
         * Get response body
         * @return
         */
        public String getBody() {
            return writer.getCopy();
        }
    }

    /**
     * Writer used to make a copy of it content in StringBuilder
     */
    private static class CopyPrintWriter extends PrintWriter {

        private StringBuilder copy = new StringBuilder();

        public CopyPrintWriter(Writer writer) {
            super(writer);
        }

        @Override
        public void write(int c) {
            copy.append((char) c); // It is actually a char, not an int.
            super.write(c);
        }

        @Override
        public void write(char[] chars, int offset, int length) {
            copy.append(chars, offset, length);
            super.write(chars, offset, length);
        }

        @Override
        public void write(String string, int offset, int length) {
            copy.append(string, offset, length);
            super.write(string, offset, length);
        }

        public String getCopy() {
            return copy.toString();
        }
    }

    /**
     * Http request wrapper used to allow multi reads for ServletRequest
     * @see javax.servlet.ServletRequest
     * @see HttpServletRequestWrapper
     */
    public static class BufferedRequestWrapper extends HttpServletRequestWrapper {

        /**
         * Custom ServletInputStream
         */
        private static final class BufferedServletInputStream extends ServletInputStream {

            private ServletInputStream inputStream;
            private ByteArrayInputStream bais;

            public BufferedServletInputStream() {}

            public BufferedServletInputStream(ByteArrayInputStream bais, ServletInputStream inputStream) {
                this.bais = bais;
                this.inputStream = inputStream;
            }

            @Override
            public int available() {
                return this.bais.available();
            }

            @Override
            public int read() {
                return this.bais.read();
            }

            @Override
            public int read(byte[] buf, int off, int len) {
                return this.bais.read(buf, off, len);
            }

            @Override
            public boolean isFinished() {
                return inputStream.isFinished();
            }

            @Override
            public boolean isReady() {
                return inputStream.isReady();
            }

            @Override
            public void setReadListener(ReadListener listener) {
                inputStream.setReadListener(listener);
            }
        }

        private byte[] mBodyBuffer;
        private HttpServletRequest request;
        private BufferedServletInputStream servletStream;

        public BufferedRequestWrapper(HttpServletRequest request) throws IOException {
            super(request);
            this.request = request;
            this.servletStream = new BufferedServletInputStream();

            InputStream in = request.getInputStream();

            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int bytesRead = -1;
            while ((bytesRead = in.read(buffer)) > 0) {
                baos.write(buffer, 0, bytesRead);
            }
            mBodyBuffer = baos.toByteArray();
        }

        public String getRequestBody() {
            return new String(mBodyBuffer, StandardCharsets.UTF_8);
        }

        @Override
        public BufferedReader getReader() throws IOException {
            return new BufferedReader(new InputStreamReader(this.getInputStream()));
        }

        @Override
        public ServletInputStream getInputStream() throws IOException {
            final ByteArrayInputStream in = new ByteArrayInputStream(mBodyBuffer);
            return new BufferedServletInputStream(in, super.getInputStream());
        }

        public void resetInputStream(byte[] newRawData) {
            mBodyBuffer = newRawData;
            this.servletStream.bais = new ByteArrayInputStream(newRawData);
        }
    }
}
