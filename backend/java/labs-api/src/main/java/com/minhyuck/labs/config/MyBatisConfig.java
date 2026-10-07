package com.minhyuck.labs.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.minhyuck.labs")
public class MyBatisConfig {

}
