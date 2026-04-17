export const RFQ_STATUSES = ["new", "in_progress", "quoted", "closed", "spam"] as const;
export type RfqStatusValue = (typeof RFQ_STATUSES)[number];

export const RFQ_EVENT_TYPES = [
  "created",
  "emailed_admin",
  "emailed_customer",
  "email_failed",
  "viewed",
  "status_changed",
  "note",
  "follow_up",
] as const;
export type RfqEventTypeValue = (typeof RFQ_EVENT_TYPES)[number];

export function isRfqStatus(value: string): value is RfqStatusValue {
  return RFQ_STATUSES.includes(value as RfqStatusValue);
}

export function isRfqEventType(value: string): value is RfqEventTypeValue {
  return RFQ_EVENT_TYPES.includes(value as RfqEventTypeValue);
}
