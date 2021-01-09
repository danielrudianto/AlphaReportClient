export interface User {
  Id?: number;
  FirstName: string;
  LastName: string;
  Email: string;
  IsActive: number;
  Password: string;
  LastPosition?: Position;
  Positions?: Position[];
  PendingPositions?: Position[];
  Position?: number;
  CreatedBy?: number | string;
}

export interface Position {
  Id?: number;
  EffectiveDate: string;
  Position: number;
  UserId?: number;
}

export interface ProjectUser {
  UserId: number;
  User?: User;
  Position: number;
}
