"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Package, Tag, Pencil } from "lucide-react";
import { catalogService } from "@/services/catalog.service";
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
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function CatalogoPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  // Product form
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productDuration, setProductDuration] = useState("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  // Category form
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: catalogService.listProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: catalogService.listCategories,
  });

  const createProductMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      editingProduct
        ? catalogService.updateProduct(editingProduct, body)
        : catalogService.createProduct(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingProduct ? "Produto atualizado!" : "Produto criado!");
      setShowNewProduct(false);
      resetProductForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteProductMutation = useMutation({
    mutationFn: catalogService.deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto removido.");
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: () =>
      editingCategory
        ? catalogService.updateCategory(editingCategory.id, categoryName)
        : catalogService.createCategory(categoryName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success(editingCategory ? "Categoria atualizada!" : "Categoria criada!");
      setShowNewCategory(false);
      setCategoryName("");
      setEditingCategory(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: catalogService.deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Categoria removida.");
    },
  });

  function resetProductForm() {
    setProductName("");
    setProductPrice("");
    setProductCategoryId("");
    setProductDuration("");
    setEditingProduct(null);
  }

  function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim() || !productPrice) {
      toast.error("Nome e preço são obrigatórios.");
      return;
    }
    const body: Record<string, unknown> = {
      name: productName.trim(),
      price: parseFloat(productPrice),
      categoryId: productCategoryId || undefined,
    };
    if (productDuration) body.durationDays = parseInt(productDuration);
    createProductMutation.mutate(body);
  }

  function openEditProduct(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductCategoryId(product.categoryId ?? "");
    setProductDuration(product.durationDays?.toString() ?? "");
    setEditingProduct(id);
    setShowNewProduct(true);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Catálogo</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">Produtos e serviços</p>
        </div>
        <Button
          onClick={() =>
            activeTab === "products" ? setShowNewProduct(true) : setShowNewCategory(true)
          }
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2"
        >
          <Plus size={16} />
          {activeTab === "products" ? "Novo Produto" : "Nova Categoria"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "products" | "categories")}>
        <TabsList className="bg-[var(--muted)]">
          <TabsTrigger value="products" className="data-[state=active]:bg-[var(--card)] gap-2">
            <Package size={14} />Produtos
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-[var(--card)] gap-2">
            <Tag size={14} />Categorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-[var(--muted-foreground)]">
              <Package size={32} />
              <p className="text-sm">Nenhum produto cadastrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product) => {
                const cat = categories.find((c) => c.id === product.categoryId);
                return (
                  <Card key={product.id} className="border-[var(--border)] bg-[var(--card)] p-4 space-y-2 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--foreground)] truncate">{product.name}</p>
                        {cat && (
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{cat.name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditProduct(product.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Remover produto?")) deleteProductMutation.mutate(product.id);
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-[var(--primary)]">{formatCurrency(product.price)}</p>
                    {product.durationDays && (
                      <p className="text-xs text-[var(--text-secondary)]">{product.durationDays} dias de duração</p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-3">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-[var(--muted-foreground)]">
              <Tag size={32} />
              <p className="text-sm">Nenhuma categoria cadastrada</p>
            </div>
          ) : (
            <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-light)] last:border-0 group">
                  <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                    <Tag size={14} style={{ color: "var(--primary)" }} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-[var(--foreground)]">{cat.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryName(cat.name);
                        setShowNewCategory(true);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Remover categoria e todos os produtos?")) {
                          deleteCategoryMutation.mutate(cat.id);
                        }
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* New Product Modal */}
      <Dialog open={showNewProduct} onOpenChange={(open) => { setShowNewProduct(open); if (!open) resetProductForm(); }}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Nome *</Label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nome do produto/serviço"
                className="bg-[var(--background)] border-[var(--border)]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-[var(--text-secondary)]">Preço (R$) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="0,00"
                  className="bg-[var(--background)] border-[var(--border)]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-[var(--text-secondary)]">Duração (dias)</Label>
                <Input
                  type="number"
                  min="1"
                  value={productDuration}
                  onChange={(e) => setProductDuration(e.target.value)}
                  placeholder="Ex: 30"
                  className="bg-[var(--background)] border-[var(--border)]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Categoria</Label>
              <Select value={productCategoryId} onValueChange={setProductCategoryId}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                  <SelectValue placeholder="Selecionar categoria..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => { setShowNewProduct(false); resetProductForm(); }} className="flex-1 border-[var(--border)]">Cancelar</Button>
              <Button type="submit" disabled={createProductMutation.isPending} className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white">
                {createProductMutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Category Modal */}
      <Dialog open={showNewCategory} onOpenChange={(open) => { setShowNewCategory(open); if (!open) { setCategoryName(""); setEditingCategory(null); } }}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Nome *</Label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Nome da categoria"
                className="bg-[var(--background)] border-[var(--border)]"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowNewCategory(false); setCategoryName(""); setEditingCategory(null); }} className="flex-1 border-[var(--border)]">Cancelar</Button>
              <Button
                onClick={() => {
                  if (!categoryName.trim()) { toast.error("Informe o nome."); return; }
                  createCategoryMutation.mutate();
                }}
                disabled={createCategoryMutation.isPending}
                className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white"
              >
                {createCategoryMutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
