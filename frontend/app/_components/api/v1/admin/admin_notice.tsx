"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { AdminNotice } from "./types";

type AdminNoticeProps = {
  notice: AdminNotice | null;
};

const noticeStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

const noticeIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function AdminNotice({ notice }: AdminNoticeProps) {
  if (!notice) return null;

  const Icon = noticeIcons[notice.type];

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${noticeStyles[notice.type]}`}
      role="status"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{notice.message}</span>
    </div>
  );
}
