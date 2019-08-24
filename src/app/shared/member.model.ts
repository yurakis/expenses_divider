export interface BasicEntity {
  id: number;
  name: string;
}

export interface Member extends BasicEntity {}

export interface Expense extends BasicEntity {
  amount: number;
  payer: Member | null;
  consumers: Member[];
}

export interface ResultItem {
  from: Member;
  to: Member;
  amount: number;
}

export type Results = ResultItem[];
