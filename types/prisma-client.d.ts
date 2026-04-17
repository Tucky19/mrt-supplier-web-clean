declare module "@prisma/client" {
  export type JsonValue =
    | string
    | number
    | boolean
    | null
    | { [key: string]: JsonValue }
    | JsonValue[];

  export namespace Prisma {
    export type InputJsonValue = JsonValue;
  }

  export class PrismaClient {
    [key: string]: any;
    constructor(options?: any);
  }

  export type RfqStatus = "new" | "in_progress" | "quoted" | "closed" | "spam";
  export type RfqEventType =
    | "created"
    | "emailed_admin"
    | "emailed_customer"
    | "email_failed"
    | "viewed"
    | "status_changed"
    | "note"
    | "follow_up";
}
