package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateTodoRequest(@NotBlank(message = "Título é obrigatório") String titulo, String descricao) { }