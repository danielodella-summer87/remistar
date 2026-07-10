import type { LucideIcon } from "lucide-react";

const toneClasses = {
  primary: "bg-opgreen-600 text-white hover:bg-opgreen-700 active:bg-opgreen-800",
  brand: "bg-petrol-700 text-white hover:bg-petrol-800 active:bg-petrol-900",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  neutral: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
};

export function DriverActionButton({
  label,
  onClick,
  icon: Icon,
  tone = "primary",
  disabled,
  type = "button",
}: {
  label: string;
  onClick?: () => void;
  icon?: LucideIcon;
  tone?: keyof typeof toneClasses;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${toneClasses[tone]}`}
    >
      {Icon && <Icon className="h-5 w-5" aria-hidden />}
      {label}
    </button>
  );
}
