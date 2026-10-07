package com.minhyuck.labs.admin.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.everyItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getMenuListReturnsTopMenus() throws Exception {
        mockMvc.perform(post("/labs-api/menus/search").contextPath("/labs-api")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalCount").value(2))
                .andExpect(jsonPath("$.data.menuList[*].menuName", containsInAnyOrder("가계부", "투자")))
                .andExpect(jsonPath("$.data.menuList[*].menuPath", containsInAnyOrder("/budget", "/invest")))
                .andExpect(jsonPath("$.data.menuList[*].subMenuList", everyItem(empty())))
                .andExpect(jsonPath("$.error").isEmpty());
    }
}
