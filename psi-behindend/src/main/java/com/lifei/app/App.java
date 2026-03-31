package com.lifei.psi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@SpringBootApplication
@MapperScan("com.lifei.psi.mapper")
public class App {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}