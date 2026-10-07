package com.minhyuck.labs.admin.dto.response;

import java.util.ArrayList;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Schema(description = "메뉴 목록 응답 DTO")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class MenuListResponseDto {

    @Schema(description = "메뉴 목록")
    private List<MenuDto> menuList = new ArrayList<>();

    @Schema(description = "총 건수")
    private int totalCount;

}
