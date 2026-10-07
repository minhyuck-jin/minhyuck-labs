package com.minhyuck.labs.admin.dto.response;

import java.util.ArrayList;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Schema(description = "메뉴 DTO")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class MenuDto {

    @Schema(description = "메뉴 ID")
    private Long menuId;

    @Schema(description = "부모 메뉴 ID")
    private Long parentMenuId;

    @Schema(description = "메뉴명")
    private String menuName;

    @Schema(description = "화면 경로")
    private String menuPath;

    @Schema(description = "정렬 순서")
    private int sortOrder;

    @Schema(description = "하위 메뉴")
    private List<MenuDto> subMenuList = new ArrayList<>();

}
