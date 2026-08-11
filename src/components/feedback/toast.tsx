"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error" | "info";

type ToastMessage = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ShowToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  showToast: (input: ShowToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(({ title, description, variant = "info" }: ShowToastInput) => {
    const id = Date.now();

    setToasts((current) => [
      ...current,
      {
        id,
        title,
        description,
        variant,
      },
    ]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => {
              setToasts((current) => current.filter((item) => item.id !== toast.id));
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider.");
  }

  return context;
}

type ToastItemProps = {
  toast: ToastMessage;
  onDismiss: () => void;
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  return (
    <div
      className="rounded-xl border bg-background p-4 shadow-lg"
      role={toast.variant === "error" ? "alert" : "status"}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">{toast.title}</p>

          {toast.description && (
            <p className="text-sm text-muted-foreground">{toast.description}</p>
          )}
        </div>

        <button
          type="button"
          aria-label="Fechar notificação"
          onClick={onDismiss}
          className="shrink-0 text-sm"
        >
          ×
        </button>
      </div>
    </div>
  );
}
