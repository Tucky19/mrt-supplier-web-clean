"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type State="UNREVIEWED"|"QUALIFIED"|"UNQUALIFIED";
export default function RfqQualificationForm({rfqId,initial,version}:{rfqId:string;initial:State;version:number}) {
  const [value,setValue]=useState<State>(initial);const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  const router=useRouter();
  async function save() {
    setBusy(true);setError("");
    try {const response=await fetch(`/api/admin/rfq/${encodeURIComponent(rfqId)}/qualification`,{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({qualification:value,version})});
      if (!response.ok) {setError(response.status===409 ? "RFQ changed. Refresh before deciding." : "Could not save qualification.");return;}
      router.refresh();
    } catch {setError("Could not save qualification.");}finally {setBusy(false);}
  }
  return <section className="rounded-3xl border border-slate-200 bg-white p-6">
    <h2 className="text-xl font-semibold">RFQ Qualification</h2>
    <p className="mt-2 text-sm text-slate-600">Explicit sales decision. Independent of RFQ status and quotation.</p>
    <label className="mt-4 block text-sm">Qualification
      <select aria-label="Qualification" value={value} onChange={e=>setValue(e.target.value as State)} disabled={busy} className="ml-3 rounded border p-2">
        <option value="UNREVIEWED">Unreviewed</option><option value="QUALIFIED">Qualified</option><option value="UNQUALIFIED">Unqualified</option>
      </select></label>
    <button onClick={save} disabled={busy} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-white">{busy ? "Saving…" : "Save qualification"}</button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </section>;
}
