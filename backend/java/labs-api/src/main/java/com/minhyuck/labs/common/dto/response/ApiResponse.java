package com.minhyuck.labs.common.dto.response;

public record ApiResponse<T>(T data, Error error) {

    public record Error(String code, String message) {}

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(data, null);
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(null, null);
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return new ApiResponse<>(null, new Error(code, message));
    }
}
