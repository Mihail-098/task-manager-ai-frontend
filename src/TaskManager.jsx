// React - componenta cu taburi: Taskuri + Raport Angajati
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function TaskManager() {
  const [view, setView] = useState("taskuri");
  const [tasks, setTasks] = useState([]);
  const [angajati, setAngajati] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Mediu");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (view === "taskuri") {
      fetch(`${API_URL}/tasks`).then(res => res.json()).then(data => setTasks(data));
    } else {
      fetch(`${API_URL}/angajati`).then(res => res.json()).then(data => setAngajati(data));
    }
  }, [view]);

  const handleSubmit = async () => {
    const newTask = { title, description, deadline, priority };
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    setTitle(""); setDescription(""); setDeadline("");
    setView("taskuri");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-4">
        <Button onClick={() => setView("taskuri")}>Taskuri</Button>
        <Button onClick={() => setView("raport")}>Raport Angajati</Button>
      </div>

      {view === "taskuri" && (
        <>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <Card>
            <CardContent className="space-y-4 p-4">
              <Label>Titlu Task</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} />
              <Label>Descriere</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} />
              <Label>Deadline</Label>
              <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
              <Label>Prioritate</Label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="border p-2 rounded">
                <option value="Scazuta">Scazuta</option>
                <option value="Mediu">Mediu</option>
                <option value="Ridicata">Ridicata</option>
              </select>
              <Button onClick={handleSubmit}>Adauga Task</Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {tasks.map((task, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold text-lg">{task.title}</h2>
                  <p>{task.description}</p>
                  <p className="text-sm">Deadline: {task.deadline}</p>
                  <p className="text-sm">Prioritate: {task.priority}</p>
                  <p className="text-sm font-medium text-green-700">Atribuit: {task.assigned_to || 'In asteptare'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {view === "raport" && (
        <>
          <h1 className="text-2xl font-bold">Raport Angajati</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {angajati.map((a, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-2">
                  <h2 className="text-xl font-semibold">{a.nume}</h2>
                  <p className="text-sm text-gray-500">Email: {a.email}</p>
                  <p className="font-medium">Taskuri active: {a.taskuri_active}</p>
                  <div className="mt-2">
                    {a.taskuri.map((t, i) => (
                      <div key={i} className="border-t pt-2 mt-2">
                        <p className="text-sm font-semibold">{t.title}</p>
                        <p className="text-xs">{t.description}</p>
                        <p className="text-xs">Deadline: {t.deadline}</p>
                        <p className="text-xs">Prioritate: {t.priority}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
