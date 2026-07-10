export interface TimelineItem {
  date: string;
  label: string;
  description?: string;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">Sin eventos registrados todavía.</p>;
  }
  return (
    <ol className="relative space-y-5 border-l border-slate-200 pl-5">
      {items.map((item, idx) => (
        <li key={idx} className="relative">
          <span className="absolute -left-[25px] top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-petrol-500 ring-1 ring-petrol-200" />
          <p className="text-xs font-medium text-slate-400">{item.date}</p>
          <p className="text-sm font-medium text-slate-800">{item.label}</p>
          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}
