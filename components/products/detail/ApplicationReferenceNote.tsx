import { getProductUiText } from "@/lib/i18n/productUi";

export default function ApplicationReferenceNote({ locale, customer = false, compact = false }: {
  locale: string; customer?: boolean; compact?: boolean;
}) {
  const text = getProductUiText(locale);
  return (
    <div className={compact ? "space-y-1 text-xs leading-5 text-slate-600" : "mt-2 space-y-1 text-sm leading-6 text-slate-600"}>
      <p className="font-medium">{customer ? text.customerReferenceLabel : text.applicationReferenceLabel}</p>
      <p>{text.applicationCaution}</p>
    </div>
  );
}
