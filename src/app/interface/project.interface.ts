import { Client } from './client.interface';
import { Task } from './task.interface';
import { ProjectUser } from './user.interface';

export interface Project {
  Id?: number;
  Name: string;
  Address: string;
  DocumentName: string;
  CreatedBy: number | string;
  CreatedDate?: string;
  ClientId: number;
  Client?: Client;
  Tasks: Task[];
  Documents: File[];
  Users: ProjectUser[];
  ConfirmedBy: number | string;
  ConfirmedDate?: string;
}
