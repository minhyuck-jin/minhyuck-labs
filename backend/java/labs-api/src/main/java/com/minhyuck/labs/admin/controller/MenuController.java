package com.minhyuck.labs.admin.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minhyuck.labs.admin.dto.response.MenuListResponseDto;
import com.minhyuck.labs.admin.service.MenuService;
import com.minhyuck.labs.common.dto.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/menus")
@Tag(name = "메뉴 API", description = "메뉴 API")
@RequiredArgsConstructor
@Slf4j
public class MenuController {

    private final MenuService menuService;

    @PostMapping(path = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "메뉴 목록", description = "메뉴 목록 요청")
    public ResponseEntity<ApiResponse<MenuListResponseDto>> getMenuList() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getMenuList()));
    }

}
