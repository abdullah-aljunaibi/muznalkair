import {
  paymentMethodLabels,
  studentAccessLabels,
  uploadStatusLabels,
  uploadsSeed,
} from "./mock-data";

export const formatCurrency = (amount: number) => `${amount.toFixed(3)} ر.ع`;

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("ar-OM", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatRelativeTime = (value: string | Date) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMin = Math.max(1, Math.round(diffMs / 60000));

  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;

  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;

  const diffDays = Math.round(diffHours / 24);
  return `منذ ${diffDays} يوم`;
};

export const getPaymentMethodLabel = (method: string) =>
  paymentMethodLabels[method as keyof typeof paymentMethodLabels] || method;

export const getStudentAccessStatus = (statuses: string[]) => {
  if (statuses.includes("COMPLETED")) return studentAccessLabels.ACTIVE;
  if (statuses.includes("PENDING")) return studentAccessLabels.PENDING_PAYMENT;
  return studentAccessLabels.SUSPENDED;
};

export const getPendingUploadsCount = () =>
  uploadsSeed.filter((item) => item.status !== "READY").length;

export const getUploadStatusLabel = (status: string) =>
  uploadStatusLabels[status as keyof typeof uploadStatusLabels] || status;
