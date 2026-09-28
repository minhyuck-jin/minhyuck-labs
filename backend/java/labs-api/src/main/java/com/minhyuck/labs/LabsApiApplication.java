package com.minhyuck.labs;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.minhyuck.labs")
public class LabsApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(LabsApiApplication.class, args);
    }

}
