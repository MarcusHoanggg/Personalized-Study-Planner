
import React, { useEffect } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

type Props = {
  open: boolean;
  type: NotificationType;
  title: string;
  message?: string;
  onClose: () => void;
};

function getColorStyles(type: NotificationType) {
  switch (type) {
    case "success":
      return "border-emerald-400 bg-emerald-50 text-emerald-700";
    case "error":
      return "border-rose-400 bg-rose-50 text-rose-700";
    case "warning":
      return "border-amber-400 bg-amber-50 text-amber-700";
    default:
      return "border-purple-400 bg-purple-50 text-purple-700";
  }
}

export default function NotificationPopup({
  open,
  type,
  title,
  message,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  const colorStyles = getColorStyles(type);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div
        className={`
          w-[320px]
          rounded-2xl
          border
          shadow-lg
          p-4
          transition-all
          duration-300
          ${colorStyles}
        `}
      >
        <div className="flex justify-between items-start gap-3">
          <div>
            <h4 className="font-semibold text-sm">{title}</h4>
            {message && (
              <p className="text-xs mt-1 text-gray-600 leading-relaxed">
                {message}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}