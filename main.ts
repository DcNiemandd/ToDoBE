import { Database } from "jsr:@db/sqlite";
import { parseArgs } from "jsr:@std/cli/parse-args";

function main(args: string[]) {
  const db = new Database("todo.db");

  db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT,
    description TEXT,
    marked BOOLEAN  
);  
`);

  const flags = parseArgs(args, {
    string: ["port"],
    boolean: ["help"],
    default: { port: "8000" },
  });

  if (flags.help) {
    console.log(`This is simple API for todo list. 
      
One task is an object:
  {
    label: string,
    desctiption: string,
    marked: boolean,
  }

You can get task(s) from '/tasks' and '/tasks/{id}'.
You can insert task to '/tasks/'. 
You can update task to '/tasks/{id}'.

NOTE: This program will make file database.`);
    return;
  }

  Deno.serve(
    {
      port: parseInt(flags.port),
    },
    async (req) => {
      const url = new URL(req.url);
      const path = url.pathname;
      const taskID = path.split("/")[2];
      // Valid path is '/tasks' and '/tasks/{id}'

      if (!path.startsWith("/tasks")) {
        return new Response("Path not found", { status: 404 });
      }

      if (req.method === "GET" && !taskID) {
        const tasks = db.prepare("SELECT * FROM tasks").all();
        return new Response(JSON.stringify(tasks), {
          status: tasks.length ? 200 : 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (req.method === "GET" && taskID) {
        const task = db.prepare("SELECT * FROM tasks WHERE id = :id").get({
          id: taskID,
        });
        return new Response(JSON.stringify(task), {
          status: task ? 200 : 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (req.method === "POST" && !taskID) {
        try {
          const { label, description, marked } = await req.json();

          const task = db.prepare(
            "INSERT INTO tasks (label, description, marked) VALUES (?, ?, ?) RETURNING *",
          ).get([label, description, marked]);

          return new Response(JSON.stringify(task), {
            status: task ? 201 : 400,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch {
          return new Response("Missing task", { status: 400 });
        }
      }

      if (req.method === "POST" && taskID) {
        try {
          const { label, description, marked } = await req.json();

          const task = db.prepare(`
          UPDATE tasks 
          SET label = ?, description = ?, marked = ? 
          WHERE id = ? 
          RETURNING *;
        `).get([label, description, marked, taskID]);

          return new Response(JSON.stringify(task), {
            status: task ? 201 : 400,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch {
          return new Response("Missing task", { status: 400 });
        }
      }

      return new Response("Path not found", { status: 404 });
    },
  );
}

if (import.meta.main) main(Deno.args);
