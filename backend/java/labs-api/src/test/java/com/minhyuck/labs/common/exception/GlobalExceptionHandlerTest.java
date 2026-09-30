package com.minhyuck.labs.common.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void badRequestExceptionHandlerReturns400() {
        var e = new MissingServletRequestParameterException("id", "String");

        var response = handler.badRequestExceptionHandler(e);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().error().code()).isEqualTo("BAD_REQUEST");
    }

    @Test
    void notFoundExceptionHandlerReturns404() {
        var e = new NoHandlerFoundException("GET", "/missing", null);

        var response = handler.notFoundExceptionHandler(e);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().error().code()).isEqualTo("NOT_FOUND");
    }

    @Test
    void internalServerErrorExceptionHandlerGenericException() {
        var response = handler.internalServerErrorExceptionHandler(new IllegalStateException("db"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().error().code()).isEqualTo("INTERNAL_SERVER_ERROR");
    }

    @Test
    void uncategorizedExceptionsMapTo500() {
        var e = new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");

        var response = handler.internalServerErrorExceptionHandler(e);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().error().code()).isEqualTo("INTERNAL_SERVER_ERROR");
    }
}
