import { useEffect, useState } from "react";

const API_URL = "/api/todo";

type TodoStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";

type Todo = {
  id: number;
  titulo: string;
  descricao: string;
  status: TodoStatus;
  dataCriacao?: string;
  dataAtualizacao?: string;
};

type TodoForm = {
  titulo: string;
  descricao: string;
  status: TodoStatus;
};

const statuses: { value: TodoStatus; label: string }[] = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDO", label: "Concluído" },
];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [form, setForm] = useState<TodoForm>({
    titulo: "",
    descricao: "",
    status: "PENDENTE",
  });

  async function fetchTodos() {
    const res = await fetch(API_URL);
    const data: Todo[] = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  function formatDate(date?: string) {
    if (!date) return "-";

    return new Date(date).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function resetForm() {
    setForm({
      titulo: "",
      descricao: "",
      status: "PENDENTE",
    });
    setEditingTodo(null);
  }

  async function createTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchTodos();
  }

  async function updateTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingTodo) return;

    await fetch(`${API_URL}/${editingTodo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchTodos();
  }

  function startEditing(todo: Todo) {
    setEditingTodo(todo);
    setForm({
      titulo: todo.titulo,
      descricao: todo.descricao,
      status: todo.status,
    });
  }

  async function deleteTodo(id: number) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchTodos();
  }

  return (
    <main className="flex h-screen flex-col bg-slate-100 p-6">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col min-h-0">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          Todo App
        </h1>

        <form
          onSubmit={editingTodo ? updateTodo : createTodo}
          className="mb-6 rounded-xl bg-white p-4 shadow shrink-0"
        >
          <input
            className="mb-3 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Titulo"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />

          <textarea
            className="mb-3 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />

          <select
            className="mb-3 w-full rounded-lg border p-3"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as TodoStatus })
            }
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              {editingTodo ? "Atualizar Todo" : "Criar Todo"}
            </button>

            {editingTodo && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-500 px-4 py-2 font-medium text-white hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div
          className="
            flex-1
            min-h-0
            overflow-y-scroll
            pr-4
            space-y-4
            scrollbar
            scrollbar-thin
            scrollbar-thumb-slate-400
            scrollbar-track-transparent
          "
        >
          {todos.map((todo) => (
            <div key={todo.id} className={`rounded-xl ${editingTodo?.id === todo.id ? "border-blue-300" : "border-white"} border-4 bg-white p-4 shadow`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {todo.titulo}
                  </h2>

                  <p className="mt-1 text-slate-600">{todo.descricao}</p>

                  <p className="mt-2 text-sm text-slate-500">
                    Status:{" "}
                    {statuses.find((s) => s.value === todo.status)?.label}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    <p>
                      Criado em: {formatDate(todo.dataCriacao)}
                    </p>

                    <p>
                      Atualizado em: {formatDate(todo.dataAtualizacao)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingTodo?.id === todo.id ?
                    <>
                      <button
                        onClick={() => resetForm()}
                        className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                      >
                        Cancelar
                      </button>
                    </>
                    :
                    <>
                      <button
                        onClick={() => startEditing(todo)}
                        className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                      >
                        Apagar
                      </button>
                    </>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}