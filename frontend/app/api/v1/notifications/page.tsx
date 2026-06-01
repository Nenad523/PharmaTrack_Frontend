"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/app/_components/auth/AuthContext";
import {
  deleteNotification,
  getMyNotifications,
  type NotificationItem,
} from "@/app/_components/api/v1/notifications/notifications_api";

function NotificationCard({
  item,
  removingId,
  onRemove,
}: {
  item: NotificationItem;
  removingId: number | null;
  onRemove: (notificationId: number) => void;
}) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-xl font-semibold text-slate-950">
          {item.medication_name} {item.strength}
        </h2>
      </div>

      <div className="flex items-end justify-between gap-4 px-5 py-4">
        <p className="text-base font-medium text-slate-900">• Nije dostupan</p>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={removingId === item.id}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-700 disabled:cursor-wait disabled:opacity-60"
        >
          {removingId === item.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Ukloni
        </button>
      </div>
    </article>
  );
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    let active = true;

    const loadNotifications = async () => {
      setIsLoading(true);
      setError("");

      try {
        const notifications = await getMyNotifications();

        if (active) {
          setItems(notifications);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Doslo je do greske pri ucitavanju notifikacija."
          );
          setItems([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadNotifications();

    return () => {
      active = false;
    };
  }, [user]);

  const handleRemove = async (notificationId: number) => {
    setRemovingId(notificationId);
    setError("");

    try {
      await deleteNotification(notificationId);
      setItems((current) =>
        current.filter((item) => item.id !== notificationId)
      );
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Doslo je do greske pri uklanjanju notifikacije."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Bell className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-950">
                  Moje notifikacije
                </h1>
                <p className="mt-2 text-base text-slate-600">
                  Pratite {items.length} {items.length === 1 ? "lijek" : "lijeka"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 px-4 py-4 sm:px-5 sm:py-5">
            {!user ? (
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600 shadow-sm">
                Za pregled pracenih lijekova potrebno je da budete prijavljeni.
              </div>
            ) : isLoading ? (
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-6 shadow-sm">
                <div className="flex items-center gap-3 text-sm font-semibold text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ucitavanje notifikacija...
                </div>
              </div>
            ) : error ? (
              <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600 shadow-sm">
                Nemate aktivnih pracenja. Kada kliknete `Obavijesti me` za lijek
                koji nije dostupan, pojaviće se ovdje.
              </div>
            ) : (
              items.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  removingId={removingId}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-5">
          <Link
            href="/api/v1/medications"
            className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            Nazad na pretragu
          </Link>
        </div>
      </section>
    </div>
  );
}
