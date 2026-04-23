"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  MapPin,
  Users,
  FileText,
  CheckSquare,
  Check,
  Trash2,
  X,
} from "lucide-react";
import { appointmentsService } from "@/services/appointments.service";
import { leadsService } from "@/services/leads.service";
import { localTaskToApi, taskTypeToApi } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TASK_TYPES, type TaskType } from "@/types";
import { cn, todayISO } from "@/lib/utils";
import { toast } from "sonner";

const TASK_TYPE_ICONS: Record<string, React.ElementType> = {
  Ligação: Phone,
  Visita: MapPin,
  Reunião: Users,
  "Retornar proposta": FileText,
  Outro: CheckSquare,
};

const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function AgendaPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [showNewTask, setShowNewTask] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("Ligação");
  const [taskDate, setTaskDate] = useState(todayISO());
  const [leadId, setLeadId] = useState("");
  const [notes, setNotes] = useState("");

  const qc = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", viewYear, viewMonth],
    queryFn: () => appointmentsService.list({ month: viewMonth + 1, year: viewYear }),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: leadsService.list,
  });

  const completeMutation = useMutation({
    mutationFn: appointmentsService.complete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentsService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa removida.");
    },
  });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => appointmentsService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa criada!");
      setShowNewTask(false);
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function resetForm() {
    setTitle("");
    setType("Ligação");
    setTaskDate(selectedDate);
    setLeadId("");
    setNotes("");
  }

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Informe o título da tarefa.");
      return;
    }
    const body = localTaskToApi({
      title: title.trim(),
      type,
      date: taskDate,
      leadId: leadId || undefined,
      notes: notes.trim() || undefined,
    });
    createMutation.mutate(body);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const tasksByDate = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      if (!map[t.date]) map[t.date] = 0;
      map[t.date]++;
    });
    return map;
  }, [tasks]);

  const selectedTasks = useMemo(
    () => tasks.filter((t) => t.date === selectedDate),
    [tasks, selectedDate]
  );

  const todayStr = todayISO();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Agenda</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {tasks.length} tarefa{tasks.length !== 1 ? "s" : ""} no mês
          </p>
        </div>
        <Button
          onClick={() => { setShowNewTask(true); setTaskDate(selectedDate); }}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2"
        >
          <Plus size={16} />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Calendar */}
        <Card className="border-[var(--border)] bg-[var(--card)] p-4 lg:col-span-3">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-[var(--foreground)]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-1">
            {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-[var(--muted-foreground)] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const hasTasks = !!tasksByDate[dateStr];
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    "relative h-9 w-full rounded-lg text-sm font-medium transition-colors flex items-center justify-center",
                    isSelected
                      ? "bg-[var(--primary)] text-white"
                      : isToday
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                      : "hover:bg-[var(--muted)] text-[var(--foreground)]"
                  )}
                >
                  {day}
                  {hasTasks && !isSelected && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: isToday ? "var(--primary)" : "var(--primary)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Task list for selected date */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--foreground)] text-sm">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"short" })}
            </h2>
            <button
              onClick={() => { setShowNewTask(true); setTaskDate(selectedDate); }}
              className="text-xs text-[var(--primary)] font-medium hover:underline flex items-center gap-1"
            >
              <Plus size={12} /> Adicionar
            </button>
          </div>

          {selectedTasks.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-[var(--muted-foreground)]">
              <CheckSquare size={24} />
              <p className="text-sm">Nenhuma tarefa nesta data</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((task) => {
                const Icon = TASK_TYPE_ICONS[task.type] ?? CheckSquare;
                return (
                  <Card key={task.id} className={cn("border-[var(--border)] bg-[var(--card)] p-3 space-y-1", task.completed && "opacity-60")}>
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => completeMutation.mutate(task.id)}
                        className={cn(
                          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                          task.completed
                            ? "bg-[var(--success)] border-[var(--success)]"
                            : "border-[var(--border)] hover:border-[var(--success)]"
                        )}
                      >
                        {task.completed && <Check size={11} color="#fff" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium text-[var(--foreground)] truncate", task.completed && "line-through text-[var(--muted-foreground)]")}>
                          {task.title}
                        </p>
                        {task.leadName && (
                          <p className="text-xs text-[var(--primary)]">{task.leadName}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Icon size={11} className="text-[var(--muted-foreground)]" />
                          <span className="text-[10px] text-[var(--muted-foreground)]">{task.type}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(task.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {task.notes && (
                      <p className="text-xs text-[var(--text-secondary)] pl-7">{task.notes}</p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">Nova Tarefa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Título *</Label>
              <Input
                placeholder="Ex: Ligar para cliente"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-[var(--text-secondary)]">Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
                  <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-[var(--text-secondary)]">Data</Label>
                <Input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="bg-[var(--background)] border-[var(--border)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Lead (opcional)</Label>
              <Select value={leadId} onValueChange={setLeadId}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                  <SelectValue placeholder="Selecionar lead..." />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((l) => <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Notas</Label>
              <Input
                placeholder="Observações..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)]"
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowNewTask(false)} className="flex-1 border-[var(--border)]">
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white">
                {createMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Criar Tarefa"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
