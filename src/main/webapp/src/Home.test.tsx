import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Home from "./Home";

const todos = [
  {
    id: 1,
    titulo: "Comprar pão",
    descricao: "Ir na padaria",
    status: "PENDENTE",
    dataCriacao: "2026-06-15T10:00:00",
    dataAtualizacao: "2026-06-15T10:00:00",
  },
];

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, options?: RequestInit) => {
        if (url === "/api/todo" && !options) {
          return Promise.resolve({
            ok: true,
            json: async () => todos,
          } as Response);
        }

        if (
          url === "/api/todo" &&
          options?.method === "POST"
        ) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ id: 2 }),
          } as Response);
        }

        if (
          url === "/api/todo/1" &&
          options?.method === "PUT"
        ) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ ...todos[0] }),
          } as Response);
        }

        if (
          url === "/api/todo/1" &&
          options?.method === "DELETE"
        ) {
          return Promise.resolve({
            ok: true,
          } as Response);
        }

        return Promise.resolve({
          ok: true,
          json: async () => [],
        } as Response);
      })
    );
  });

  test("renders title", () => {
    render(<Home />);

    expect(screen.getByText("Todo App")).toBeInTheDocument();
  });

  test("loads todos on mount", async () => {
    render(<Home />);

    expect(
      await screen.findByText("Comprar pão")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ir na padaria")
    ).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledWith("/api/todo");
  });

  test("creates a todo", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await screen.findByText("Comprar pão");

    await user.type(
      screen.getByPlaceholderText("Titulo"),
      "Novo Todo"
    );

    await user.type(
      screen.getByPlaceholderText("Descrição"),
      "Descrição teste"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Criar Todo",
      })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/todo",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
  });

  test("enters edit mode", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await screen.findByText("Comprar pão");

    await user.click(
      screen.getByRole("button", {
        name: "Editar",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Atualizar Todo",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Comprar pão")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Ir na padaria")
    ).toBeInTheDocument();
  });

  test("updates a todo", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await screen.findByText("Comprar pão");

    await user.click(
      screen.getByRole("button", {
        name: "Editar",
      })
    );

    const input = screen.getByDisplayValue(
      "Comprar pão"
    );

    await user.clear(input);
    await user.type(input, "Comprar leite");

    await user.click(
      screen.getByRole("button", {
        name: "Atualizar Todo",
      })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/todo/1",
        expect.objectContaining({
          method: "PUT",
        })
      );
    });
  });

  test("cancels editing", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await screen.findByText("Comprar pão");

    await user.click(
      screen.getByRole("button", {
        name: "Editar",
      })
    );

    await user.click(
      screen.getAllByRole("button", {
        name: "Cancelar",
      })[0]
    );

    expect(
      screen.getByRole("button", {
        name: "Criar Todo",
      })
    ).toBeInTheDocument();
  });

  test("deletes a todo", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await screen.findByText("Comprar pão");

    await user.click(
      screen.getByRole("button", {
        name: "Apagar",
      })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/todo/1",
        {
          method: "DELETE",
        }
      );
    });
  });
});