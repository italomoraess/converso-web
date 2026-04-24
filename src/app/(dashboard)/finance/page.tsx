"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { DatePicker } from "@/components/ui/date-picker";
import { financeService } from "@/services/finance.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TransactionType } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

const MONTH_NAMES = [
  "Jan","Fev","Mar","Abr","Mai","Jun",
  "Jul","Ago","Set","Out","Nov","Dez",
];

export default function FinanceiroPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [showNew, setShowNew] = useState(false);
  const [txType, setTxType] = useState<TransactionType>("income");

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 10));
  const [formType, setFormType] = useState<TransactionType>("income");

  const qc = useQueryClient();

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", year, month],
    queryFn: () => financeService.listTransactions({ year, month }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["finance-categories"],
    queryFn: () => financeService.listCategories(),
  });

  const { data: summary } = useQuery({
    queryKey: ["finance-summary", year, month],
    queryFn: () => financeService.summary({ year, month }),
  });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => financeService.createTransaction(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["finance-summary"] });
      toast.success("Transação criada!");
      setShowNew(false);
      setAmount("");
      setDescription("");
      setCategoryId("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: financeService.deleteTransaction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["finance-summary"] });
      toast.success("Removido.");
    },
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !categoryId) {
      toast.error("Informe o valor e a categoria.");
      return;
    }
    createMutation.mutate({
      type: formType,
      amount: parseFloat(amount),
      description: description.trim() || undefined,
      categoryId,
      date: txDate,
    });
  }

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const filteredTx = useMemo(
    () => transactions.filter((t) => t.type === txType),
    [transactions, txType]
  );

  const filteredCategories = categories.filter((c) => c.type === formType);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Financeiro</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">Controle de receitas e despesas</p>
        </div>
        <Button
          onClick={() => setShowNew(true)}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2"
        >
          <Plus size={16} />
          Nova Transação
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="font-semibold text-[var(--foreground)] min-w-[120px] text-center">
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 border-[var(--border)] bg-[var(--card)] space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Receitas</span>
          </div>
          <p className="text-xl font-bold text-emerald-600">
            {formatCurrency(summary?.income ?? 0)}
          </p>
        </Card>
        <Card className="p-4 border-[var(--border)] bg-[var(--card)] space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <TrendingDown size={16} className="text-red-500" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Despesas</span>
          </div>
          <p className="text-xl font-bold text-red-500">
            {formatCurrency(summary?.expense ?? 0)}
          </p>
        </Card>
        <Card className="p-4 border-[var(--border)] bg-[var(--card)] space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <DollarSign size={16} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Saldo</span>
          </div>
          <p className={cn("text-xl font-bold", (summary?.balance ?? 0) >= 0 ? "text-emerald-600" : "text-red-500")}>
            {formatCurrency(summary?.balance ?? 0)}
          </p>
        </Card>
      </div>

      <Tabs value={txType} onValueChange={(v) => setTxType(v as TransactionType)}>
        <TabsList className="bg-[var(--muted)]">
          <TabsTrigger value="income" className="data-[state=active]:bg-[var(--card)]">Receitas</TabsTrigger>
          <TabsTrigger value="expense" className="data-[state=active]:bg-[var(--card)]">Despesas</TabsTrigger>
        </TabsList>

        <TabsContent value={txType} className="mt-3">
          {filteredTx.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-[var(--muted-foreground)]">
              <DollarSign size={32} />
              <p className="text-sm">Nenhuma transação neste período</p>
            </div>
          ) : (
            <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
              {filteredTx.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-light)] last:border-0 group">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    tx.type === "income" ? "bg-emerald-500" : "bg-red-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {tx.description || tx.category}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {tx.category} · {new Date(tx.date + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className={cn(
                    "text-sm font-bold shrink-0",
                    tx.type === "income" ? "text-emerald-600" : "text-red-500"
                  )}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.value)}
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(tx.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">Nova Transação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Tipo</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setFormType("income"); setCategoryId(""); }}
                  className={cn(
                    "py-2 rounded-xl border text-sm font-medium transition-colors",
                    formType === "income"
                      ? "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-950"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--muted)]"
                  )}
                >
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => { setFormType("expense"); setCategoryId(""); }}
                  className={cn(
                    "py-2 rounded-xl border text-sm font-medium transition-colors",
                    formType === "expense"
                      ? "bg-red-100 border-red-500 text-red-700 dark:bg-red-950"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--muted)]"
                  )}
                >
                  Despesa
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-[var(--text-secondary)]">Valor (R$) *</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-[var(--background)] border-[var(--border)]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-[var(--text-secondary)]">Data</Label>
                <DatePicker value={txDate} onChange={setTxDate} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Categoria *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                  <SelectValue placeholder="Selecionar categoria..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Descrição</Label>
              <Input
                placeholder="Descrição da transação..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)]"
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowNew(false)} className="flex-1 border-[var(--border)]">
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white">
                {createMutation.isPending ? <Spinner className="w-4 h-4 text-white" /> : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
