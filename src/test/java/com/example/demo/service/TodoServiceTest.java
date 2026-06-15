package com.example.demo.service;

import com.example.demo.dto.CreateTodoRequest;
import com.example.demo.dto.UpdateTodoRequest;
import com.example.demo.model.Todo;
import com.example.demo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

  @Mock
  private TodoRepository repository;

  @InjectMocks
  private TodoService service;

  private Todo todo;

  @BeforeEach
  void setUp() {
    todo = new Todo();
    todo.setId(1L);
    todo.setTitulo("Test Todo");
    todo.setDescricao("Description");
  }

  @Test
  void shouldCreateTodo() {
    CreateTodoRequest request =
        new CreateTodoRequest("New Todo", "New Description");

    when(repository.save(any(Todo.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    Todo result = service.createTodo(request);

    assertEquals("New Todo", result.getTitulo());
    assertEquals("New Description", result.getDescricao());

    verify(repository).save(any(Todo.class));
  }

  @Test
  void shouldReturnAllTodos() {
    when(repository.findAll()).thenReturn(List.of(todo));

    List<Todo> result = service.getTodos();

    assertEquals(1, result.size());
    assertEquals(todo, result.get(0));

    verify(repository).findAll();
  }

  @Test
  void shouldReturnTodoById() {
    when(repository.findById(1L))
        .thenReturn(Optional.of(todo));

    Todo result = service.getTodo(1L);

    assertEquals(todo, result);

    verify(repository).findById(1L);
  }

  @Test
  void shouldThrowWhenTodoNotFound() {
    when(repository.findById(1L))
        .thenReturn(Optional.empty());

    RuntimeException exception =
        assertThrows(RuntimeException.class,
            () -> service.getTodo(1L));

    assertEquals("Todo not found", exception.getMessage());
  }

  @Test
  void shouldDeleteTodo() {
    service.deleteTodo(1L);

    verify(repository).deleteById(1L);
  }

  @Test
  void shouldUpdateAllFields() {
    UpdateTodoRequest request =
        new UpdateTodoRequest(
            "Updated Title",
            "Updated Description",
            todo.getStatus()
        );

    when(repository.findById(1L))
        .thenReturn(Optional.of(todo));

    when(repository.save(any(Todo.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    Todo result = service.updateTodo(1L, request);

    assertEquals("Updated Title", result.getTitulo());
    assertEquals("Updated Description", result.getDescricao());

    verify(repository).findById(1L);
    verify(repository).save(todo);
  }

  @Test
  void shouldPartiallyUpdateTodo() {
    String originalDescription = todo.getDescricao();

    UpdateTodoRequest request =
        new UpdateTodoRequest(
            "Updated Title",
            null,
            null
        );

    when(repository.findById(1L))
        .thenReturn(Optional.of(todo));

    when(repository.save(any(Todo.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    Todo result = service.updateTodo(1L, request);

    assertEquals("Updated Title", result.getTitulo());
    assertEquals(originalDescription, result.getDescricao());

    verify(repository).save(todo);
  }

  @Test
  void shouldThrowWhenUpdatingNonExistingTodo() {
    UpdateTodoRequest request =
        new UpdateTodoRequest(
            "Title",
            "Description",
            null
        );

    when(repository.findById(1L))
        .thenReturn(Optional.empty());

    RuntimeException exception =
        assertThrows(RuntimeException.class,
            () -> service.updateTodo(1L, request));

    assertEquals("Todo not found", exception.getMessage());

    verify(repository, never()).save(any());
  }
}
