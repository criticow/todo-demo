package com.example.demo.controller;

import com.example.demo.dto.CreateTodoRequest;
import com.example.demo.dto.UpdateTodoRequest;
import com.example.demo.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todo")
public class TodoController {
  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  @PostMapping
  public ResponseEntity<?> createTodo(@Valid @RequestBody CreateTodoRequest request) {
    return ResponseEntity.ok(todoService.createTodo(request));
  }

  @GetMapping
  public ResponseEntity<?> getTodos() {
    return ResponseEntity.ok(todoService.getTodos());
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getTodo(@PathVariable Long id) {
    return ResponseEntity.ok(todoService.getTodo(id));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
    todoService.deleteTodo(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateTodo(
      @PathVariable Long id,
      @Valid @RequestBody UpdateTodoRequest request
  ) {
    return ResponseEntity.ok(todoService.updateTodo(id, request));
  }
}