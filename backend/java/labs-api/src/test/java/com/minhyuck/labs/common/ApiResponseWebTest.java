package com.minhyuck.labs.common;

import com.minhyuck.labs.common.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ApiResponseTestController.class)
@Import(GlobalExceptionHandler.class)
class ApiResponseWebTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void successReturnsApiResponseEnvelope() throws Exception {
        mockMvc.perform(post("/test/api-response/echo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"hello\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.message").value("hello"))
                .andExpect(jsonPath("$.error").isEmpty());
    }

    @Test
    void validationReturnsErrorEnvelope() throws Exception {
        mockMvc.perform(post("/test/api-response/echo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data").isEmpty())
                .andExpect(jsonPath("$.error.code").value("BAD_REQUEST"));
    }

    @Test
    void malformedJsonReturnsErrorEnvelope() throws Exception {
        mockMvc.perform(post("/test/api-response/echo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{not-json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("BAD_REQUEST"));
    }
}
