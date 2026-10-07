package com.minhyuck.labs.admin.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import com.minhyuck.labs.admin.dto.response.MenuDto;
import com.minhyuck.labs.admin.dto.response.MenuListResponseDto;
import com.minhyuck.labs.admin.mapper.MenuMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {

    private final MenuMapper menuMapper;

    public MenuListResponseDto getMenuList() {
        MenuListResponseDto responseDto = new MenuListResponseDto();

        /********************************************************************
         * 1. 메뉴 목록 조회
         ********************************************************************/
        List<MenuDto> menuList = menuMapper.selectMenuList();

        /********************************************************************
         * 2. 부모 메뉴 목록 세팅
         ********************************************************************/
        List<MenuDto> parentMenuList = menuList.stream()
                .filter(menuDto -> ObjectUtils.isEmpty(menuDto.getParentMenuId()))
                .toList();
        responseDto.setMenuList(parentMenuList);
        responseDto.setTotalCount(parentMenuList.size());

        /********************************************************************
         * 3. 하위 메뉴 목록 세팅
         ********************************************************************/
        for (MenuDto parentMenuDto : parentMenuList) {
            List<MenuDto> subMenuList = menuList.stream()
                    .filter(menuDto -> parentMenuDto.getMenuId().equals(menuDto.getParentMenuId()))
                    .sorted(Comparator.comparingInt(MenuDto::getSortOrder))
                    .toList();
            parentMenuDto.getSubMenuList().addAll(subMenuList);
        }

        return responseDto;
    }

}
