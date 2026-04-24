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
  CalendarDays,
  X,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { DatePicker } from "@/components/ui/date-picker";
import { appointmentsService } from "@/services/appointments.service";
import { leadsService } from "@/services/leads.service";
import { localTaskToApi } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TASK_TYPES, TASK_TYPE_LABELS, type TaskType } from "@/types";
import { cn, todayISO } from "@/lib/utils";
import { toast } from "sonner";

const TASK_TYPE_ICONS: Record<TaskType, React.ElementType> = {
  Call: Phone,
  Visit: MapPin,
  Meeting: Users,
  "Follow Up": FileText,
  Other: CheckSquare,
};

const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const DAY_NAMES = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns 0=Monday … 6=Sunday
function getFirstDayMonBased(year: number, month: number) {
  const day = new Date(year, month, 1).getDay(); // 0=Sun…6=Sat
  return (day + 6) % 7;
}

export default function AgendaPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);

  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("Call");
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
    setTaskType("Call");
    setTaskDate(selectedDate ?? todayISO());
    setLeadId("");
    setNotes("");
  }

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Informe o título da tarefa."); return; }
    createMutation.mutate(
      localTaskToApi({
        title: title.trim(),
        type: taskType,
        date: taskDate,
        leadId: leadId || undefined,
        notes: notes.trim() || undefined,
      })
    );
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(todayISO());
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayMonBased(viewYear, viewMonth);
  const todayStr = todayISO();

  const tasksByDate = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => { map[t.date] = (map[t.date] ?? 0) + 1; });
    return map;
  }, [tasks]);

  const selectedTasks = useMemo(
    () => (selectedDate ? tasks.filter((t) => t.date === selectedDate) : []),
    [tasks, selectedDate]
  );

  return (
    <div className="p-6 flex flex-col gap-5" style={{ height: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Agenda</h1>
        <Button
          onClick={() => { setShowNewTask(true); setTaskDate(selectedDate ?? todayISO()); }}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2"
        >
          <Plus size={16} />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* ── Calendar ── */}
        <div className="flex-1 min-w-0 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col">
          {/* Nav bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)]">
            <button
              onClick={prevMonth}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
            >
              <ChevronRight size={15} />
            </button>
            <span className="font-semibold text-[var(--foreground)] text-sm ml-1">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={goToday}
              className="ml-auto text-xs font-medium px-3 py-1 rounded-md border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              Hoje
            </button>
          </div>

          {/* Day-of-week header */}
          <div className="grid grid-cols-7 border-b border-[var(--border)]">
            {DAY_NAMES.map((d, i) => (
              <div
                key={d}
                className={cn(
                  "text-center text-[11px] font-semibold text-[var(--muted-foreground)] py-2",
                  i >= 5 && "bg-[var(--muted)]/50"
                )}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
            {/* Leading empty cells */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`e-${i}`}
                className={cn(
                  "border-b border-r border-[var(--border)]",
                  i >= 5 && "bg-[var(--muted)]/30"
                )}
              />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const colIdx = (firstDay + i) % 7;
              const isWeekend = colIdx >= 5;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const count = tasksByDate[dateStr] ?? 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={cn(
                    "relative border-b border-r border-[var(--border)] p-2 text-left transition-colors",
                    "min-h-[90px] flex flex-col",
                    isWeekend && "bg-[var(--muted)]/30",
                    isSelected && "bg-[var(--primary)]/10",
                    !isSelected && "hover:bg-[var(--muted)]/50"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium",
                      isToday && "bg-[var(--primary)] text-white",
                      !isToday && isSelected && "text-[var(--primary)] font-semibold",
                      !isToday && !isSelected && "text-[var(--foreground)]"
                    )}
                  >
                    {day}
                  </span>

                  {count > 0 && (
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {Array.from({ length: Math.min(count, 5) }).map((_, di) => (
                        <span
                          key={di}
                          className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Task detail panel ── */}
        {selectedDate && (
          <div className="w-72 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col">
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-[var(--foreground)] capitalize truncate">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {selectedTasks.length} tarefa{selectedTasks.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { setShowNewTask(true); setTaskDate(selectedDate); }}
                  className="w-7 h-7 rounded-md flex items-center justify-center bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-colors"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Task list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {selectedTasks.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center text-[var(--muted-foreground)]">
                  <CalendarDays size={24} />
                  <p className="text-sm">Nenhuma tarefa neste dia</p>
                  <button
                    onClick={() => { setShowNewTask(true); setTaskDate(selectedDate); }}
                    className="text-xs text-[var(--primary)] hover:underline"
                  >
                    Adicionar tarefa
                  </button>
                </div>
              ) : (
                selectedTasks.map((task) => {
                  const Icon = TASK_TYPE_ICONS[task.type] ?? CheckSquare;
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "rounded-lg border border-[var(--border)] bg-[var(--background)] p-3",
                        task.completed && "opacity-60"
                      )}
                    >
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
                          <p className={cn(
                            "text-sm font-medium text-[var(--foreground)] truncate",
                            task.completed && "line-through text-[var(--muted-foreground)]"
                          )}>
                            {task.title}
                          </p>
                          {task.leadName && (
                            <p className="text-xs text-[var(--primary)] truncate">{task.leadName}</p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <Icon size={11} className="text-[var(--muted-foreground)]" />
                            <span className="text-[10px] text-[var(--muted-foreground)]">
                              {TASK_TYPE_LABELS[task.type]}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMutation.mutate(task.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[var(--muted-foreground)] hover:text-red-600 transition-colors shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-[var(--text-secondary)] pl-7 mt-1">{task.notes}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Task Dialog */}
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
                <Select value={taskType} onValueChange={(v) => setTaskType(v as TaskType)}>
                  <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{TASK_TYPE_LABELS[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-[var(--text-secondary)]">Data</Label>
                <DatePicker value={taskDate} onChange={setTaskDate} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Lead (opcional)</Label>
              <Select value={leadId} onValueChange={setLeadId}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                  <SelectValue placeholder="Selecionar lead..." />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewTask(false)}
                className="flex-1 border-[var(--border)]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white"
              >
                {createMutation.isPending ? <Spinner className="w-4 h-4 text-white" /> : "Criar Tarefa"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
