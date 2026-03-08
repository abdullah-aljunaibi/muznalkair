import {
  couponsSeed,
  paymentMethodLabels,
  recentActivitySeed,
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

export const getPaymentMethodLabel = (method: string) =>
  paymentMethodLabels[method as keyof typeof paymentMethodLabels] || method;

export const getStudentAccessStatus = (statuses: string[]) => {
  if (statuses.includes("COMPLETED")) return studentAccessLabels.ACTIVE;
  if (statuses.includes("PENDING")) return studentAccessLabels.PENDING_PAYMENT;
  return studentAccessLabels.SUSPENDED;
};

export const getAnalyticsExtras = () => ({
  recentActivity: recentActivitySeed,
  couponCount: couponsSeed.length,
  pendingUploads: uploadsSeed.filter((item) => item.status !== "READY").length,
});

export const getUploadStatusLabel = (status: string) =>
  uploadStatusLabels[status as keyof typeof uploadStatusLabels] || status;
