type Ticket = {
  id: string;
  description: string;
  category: string | null;
  sentiment: string | null;
  processed: boolean;
  created_at: string;
};
export type { Ticket };