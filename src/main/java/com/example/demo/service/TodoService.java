package com.example.demo.service;

import com.example.demo.dto.CreateTodoRequest;
import com.example.demo.dto.UpdateTodoRequest;
import com.example.demo.model.Todo;
import com.example.demo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {
  private final TodoRepository repository;

  public TodoService(TodoRepository repository) {
    this.repository = repository;
  }

  public Todo createTodo(CreateTodoRequest request) {
    Todo todo = new Todo();
    todo.setTitulo(request.titulo());
    todo.setDescricao(request.descricao());

    return repository.save(todo);
  }

  public List<Todo> getTodos() {
    return repository.findAll();
  }

  public Todo getTodo(Long id) {
    return repository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
  }

  public void deleteTodo(Long id) {
    repository.deleteById(id);
  }

  public Todo updateTodo(Long id, UpdateTodoRequest request) {
    Todo todo = repository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));

    if (request.titulo() != null) {
      todo.setTitulo(request.titulo());
    }

    if (request.descricao() != null) {
      todo.setDescricao(request.descricao());
    }

    if (request.status() != null) {
      todo.setStatus(request.status());
    }

    return repository.save(todo);
  }
}