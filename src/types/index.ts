export type { Database } from "./database";

import type { Database } from "./database";

export type ServiceCategory =
  Database["public"]["Tables"]["service_categories"]["Row"];
export type SMEProfile =
  Database["public"]["Tables"]["sme_profiles"]["Row"];
export type SMEService =
  Database["public"]["Tables"]["sme_services"]["Row"];

export type SMEProfileWithServices = SMEProfile & {
  sme_services: (SMEService & { service_categories: ServiceCategory })[];
};
