export interface Task {
  Id?: number;
  Name: string;
  Description: string;
  BudgetPrice?: number;
  Price?: number;
  Quantity?: number;
  Done?: number;
  Children?: Task[];
  EstimatedDuration?: number;
  Timeline?: number;
  End?: number;
  Unit: string;
}

export interface ProjectItem {
  Id: number;
  Name: string;
  Description: string;
  BudgetPrice: number;
  Price: number;
  Quantity?: number;
  Children: ProjectItem[];
  EstimatedDuration?: number;
  Timeline?: number;
  ParentId: number | string;
  End?: number;
  Unit: string;
}
