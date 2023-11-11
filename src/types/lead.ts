import type { Repository } from "../store";

export interface LeadConfig extends Repository {
  // is new repository
  isNewRepo: boolean | undefined;
}
