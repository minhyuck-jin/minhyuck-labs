package com.minhyuck.labs.common;

import com.minhyuck.labs.common.dto.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test/api-response")
class ApiResponseTestController {

    @PostMapping("/echo")
    ResponseEntity<ApiResponse<EchoResponseDto>> echo(@Valid @RequestBody EchoRequestDto requestDto) {
        EchoResponseDto responseDto = new EchoResponseDto(requestDto.getMessage());

        return ResponseEntity.ok(ApiResponse.ok(responseDto));
    }

    @Getter
    @Setter
    @NoArgsConstructor
    static class EchoRequestDto {

        @NotBlank
        private String message;
    }

    @Getter
    @NoArgsConstructor
    static class EchoResponseDto {

        private String message;

        EchoResponseDto(String message) {
            this.message = message;
        }
    }
}
