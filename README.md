# Simple API for todo list. 
This uses [<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Deno_Logo_2024.svg/1200px-Deno_Logo_2024.svg.png'  height="16" style="text-align: center" /> Deno](https://deno.com/) (javascript runtime). You can use tasks to run and compile the program.
      
One task is an object:
```typescript
{
    label: string,
    desctiption: string,
    marked: boolean,
}
```

#### Endpoints:
- You can get task(s) from '/tasks' and '/tasks/{id}'.
- You can insert task to '/tasks/'. 
- You can update task to '/tasks/{id}'.

#### Flags:
- `--help` Shows help
- `--port` Sets port, default `8000`
- `--db-name` Sets name of used db file, default `todo`

**NOTE**: This program will make file database.