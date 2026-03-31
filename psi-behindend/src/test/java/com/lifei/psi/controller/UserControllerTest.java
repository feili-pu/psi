package com.lifei.psi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifei.psi.entity.User;
import com.lifei.psi.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllUsers() throws Exception {
        // 准备测试数据
        User user1 = new User();
        user1.setUsername("zhangsan");
        user1.setRealName("张三");
        user1.setEmail("zhangsan@example.com");
        user1.setDepartment("销售部");
        
        User user2 = new User();
        user2.setUsername("lisi");
        user2.setRealName("李四");
        user2.setEmail("lisi@example.com");
        user2.setDepartment("采购部");
        
        List<User> users = Arrays.asList(user1, user2);
        
        when(userService.getAllUsers()).thenReturn(users);

        // 执行测试
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].realName").value("张三"))
                .andExpect(jsonPath("$[1].realName").value("李四"));
    }

    @Test
    public void testGetUserById() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setUsername("zhangsan");
        user.setRealName("张三");
        user.setEmail("zhangsan@example.com");
        
        when(userService.getUserById(1L)).thenReturn(user);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.realName").value("张三"))
                .andExpect(jsonPath("$.email").value("zhangsan@example.com"));
    }

    @Test
    public void testCreateUser() throws Exception {
        User newUser = new User();
        newUser.setUsername("newuser");
        newUser.setRealName("新用户");
        newUser.setEmail("newuser@example.com");
        newUser.setDepartment("IT部");
        
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("newuser");
        savedUser.setRealName("新用户");
        savedUser.setEmail("newuser@example.com");
        savedUser.setDepartment("IT部");
        
        when(userService.createUser(any(User.class))).thenReturn(savedUser);

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.realName").value("新用户"));
    }

    @Test
    public void testUpdateUser() throws Exception {
        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setUsername("updated");
        updatedUser.setRealName("更新用户");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setDepartment("财务部");
        
        when(userService.updateUser(any(User.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.realName").value("更新用户"));
    }

    @Test
    public void testDeleteUser() throws Exception {
        when(userService.deleteUser(anyLong())).thenReturn(true);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("用户删除成功"));
    }
}