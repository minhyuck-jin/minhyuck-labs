package com.minhyuck.labs.common.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Api 응답")
public record ApiResponse<T>(@Schema(description = "성공 시 결과") T data, @Schema(description = "실패 시 오류") ResponseError error) {

    @Schema(description = "Api 응답 Error")
    public record ResponseError(@Schema(description = "코드") String code, @Schema(description = "메시지") String message) {
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(data, null);
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(null, null);
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return new ApiResponse<>(null, new ResponseError(code, message));
    }
}
