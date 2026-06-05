"use client";

import { useTransition } from "react";
import {
  deleteAccountingAction,
  saveAccountingAction,
  updateAccountingStatusAction,
} from "@/lib/admin/actions";
import {
  categoryLabels,
  formatMoney,
  type AccountingCategory,
} from "@/lib/accounting-store";
import type { AccountingEntry } from "@/lib/db/schema";

const categories = Object.entries(categoryLabels) as [AccountingCategory, string][];

const paymentMethods = [
  ["bank_transfer", "Havale / EFT"],
  ["credit_card", "Kredi kartı"],
  ["cash", "Nakit"],
  ["other", "Diğer"],
] as const;

type Props = {
  entries: AccountingEntry[];
  summary: { income: number; expense: number; balance: number; pending: number; count: number };
  dbConnected: boolean;
};

export default function AccountingManager({ entries, summary, dbConnected }: Props) {
  const [pending, start] = useTransition();
  const today = new Date().toISOString().slice(0, 10);

  if (!dbConnected) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
        Muhasebe kayıtları için Neon veritabanı gerekli.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[12px] text-muted">Toplam gelir</p>
          <p className="mt-1 text-xl font-bold text-emerald-800">{formatMoney(summary.income)}</p>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-[12px] text-muted">Toplam gider</p>
          <p className="mt-1 text-xl font-bold text-rose-800">{formatMoney(summary.expense)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-[12px] text-muted">Net bakiye</p>
          <p className="mt-1 text-xl font-bold text-navy">{formatMoney(summary.balance)}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-[12px] text-muted">Bekleyen tahsilat</p>
          <p className="mt-1 text-xl font-bold">{formatMoney(summary.pending)}</p>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Yeni kayıt</h2>
        <form
          action={(fd) => start(() => saveAccountingAction(fd))}
          className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="text-[12px] font-medium">Tür</label>
            <select name="type" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm">
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium">Kategori</label>
            <select name="category" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm">
              {categories.map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium">Tutar (₺)</label>
            <input
              name="amount"
              type="number"
              required
              min={1}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-[12px] font-medium">Açıklama *</label>
            <input
              name="description"
              required
              placeholder="Örn. 5 ilan paketi satışı — Ahmet Y."
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium">Tarih</label>
            <input
              name="entryDate"
              type="date"
              defaultValue={today}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium">Ödeme yöntemi</label>
            <select name="paymentMethod" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm">
              {paymentMethods.map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium">Durum</label>
            <select name="status" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm">
              <option value="completed">Tamamlandı</option>
              <option value="pending">Beklemede</option>
              <option value="cancelled">İptal</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium">Referans / fatura no</label>
            <input name="reference" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">Müşteri adı</label>
            <input name="customerName" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">Müşteri e-posta</label>
            <input name="customerEmail" type="email" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="btn-cta rounded-sm px-4 py-2.5 text-sm font-bold sm:col-span-2 lg:col-span-3"
          >
            Kaydı ekle
          </button>
        </form>
      </section>

      <section className="overflow-x-auto rounded-lg border border-border bg-white">
        <h2 className="border-b border-border px-4 py-3 text-sm font-bold">
          Hareketler ({entries.length})
        </h2>
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="bg-[#fafafa] text-[12px] text-muted">
            <tr>
              <th className="px-3 py-2">Tarih</th>
              <th className="px-3 py-2">Tür</th>
              <th className="px-3 py-2">Kategori</th>
              <th className="px-3 py-2">Açıklama</th>
              <th className="px-3 py-2">Tutar</th>
              <th className="px-3 py-2">Durum</th>
              <th className="px-3 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="px-3 py-2 whitespace-nowrap">
                  {new Date(row.entryDate).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      row.type === "income"
                        ? "font-semibold text-emerald-700"
                        : "font-semibold text-rose-700"
                    }
                  >
                    {row.type === "income" ? "Gelir" : "Gider"}
                  </span>
                </td>
                <td className="px-3 py-2">{categoryLabels[row.category as AccountingCategory]}</td>
                <td className="px-3 py-2">
                  <p>{row.description}</p>
                  {row.customerName ? (
                    <p className="text-[11px] text-muted">{row.customerName}</p>
                  ) : null}
                </td>
                <td className="px-3 py-2 font-semibold">{formatMoney(row.amount)}</td>
                <td className="px-3 py-2">
                  {row.status === "completed"
                    ? "Tamam"
                    : row.status === "pending"
                      ? "Bekliyor"
                      : "İptal"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {row.status === "pending" ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => start(() => updateAccountingStatusAction(row.id, "completed"))}
                        className="rounded bg-emerald-600 px-2 py-0.5 text-[11px] text-white"
                      >
                        Tahsil et
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (confirm("Kayıt silinsin mi?")) {
                          start(() => deleteAccountingAction(row.id));
                        }
                      }}
                      className="rounded border border-rose-200 px-2 py-0.5 text-[11px] text-rose-700"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 ? (
          <p className="p-6 text-center text-[13px] text-muted">Henüz muhasebe kaydı yok.</p>
        ) : null}
      </section>
    </div>
  );
}
