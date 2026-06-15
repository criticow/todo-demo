package com.example.demo.dto;

import com.example.demo.model.TodoStatus;

public record UpdateTodoRequest(String titulo, String descricao, TodoStatus status) { }