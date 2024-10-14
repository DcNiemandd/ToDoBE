# Simple API for todo list. 
      
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