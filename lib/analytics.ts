import { safeGrowthContext, safeId } from "@/lib/analytics/contract";
export function track(event: {
  type: "search" | "click_result" | "add_to_quote"; query?: string; partNo?: string;
  matchType?: string; resultCount?: number; eventId?: string; locale?: string;
  eventSource?: string; sessionId?: string; searchEventId?: string;
}) {
  const safe = safeGrowthContext({ search_term:event.query, part_number:event.partNo,
    match_type:event.matchType, locale:event.locale, event_source:event.eventSource,
    session_id:event.sessionId, search_event_id:event.searchEventId });
  fetch("/api/analytics/search",{ method:"POST",headers:{"Content-Type":"application/json"},
    keepalive:true,body:JSON.stringify({type:event.type,query:safe.search_term,
      partNo:safe.part_number,matchType:safe.match_type,locale:safe.locale,
      eventSource:safe.event_source,sessionId:safe.session_id,searchEventId:safe.search_event_id,
      eventId:safeId(event.eventId),resultCount:event.resultCount}) }).catch(()=>{});
}
