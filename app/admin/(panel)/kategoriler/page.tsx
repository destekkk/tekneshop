import CategoryManager from "@/components/admin/CategoryManager";
import { getCategoryTree } from "@/lib/categories-store";
import { isDbConfigured } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const tree = await getCategoryTree();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Kategori Yönetimi</h1>
        <p className="text-[13px] text-muted">
          Sol menüdeki ana kategoriler ve alt kategorileri buradan ekleyin, düzenleyin veya silin.
          Değişiklikler sitede anında yansır.
        </p>
      </div>
      <CategoryManager tree={tree} dbConnected={isDbConfigured()} />
    </div>
  );
}
