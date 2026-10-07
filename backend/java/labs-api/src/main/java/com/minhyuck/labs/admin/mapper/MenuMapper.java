package com.minhyuck.labs.admin.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.minhyuck.labs.admin.dto.response.MenuDto;

@Mapper
public interface MenuMapper {

    List<MenuDto> selectMenuList();

}
