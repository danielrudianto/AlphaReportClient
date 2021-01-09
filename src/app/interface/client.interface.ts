export interface Client {
  Id?: number;
  Name: string;
  Address: string;
  City: string;
  PhoneNumber: string;
  TaxIdentificationNumber: string;
  HasRelation?: boolean;
  CreatedBy: string | number;
  CreatedDate?: string;
  Contacts?: ClientContact[];
}

export interface ClientContact {
  Id?: number;
  Name: string;
  Position: String;
  PhoneNumber: String;
  Email: String;
  CreatedBy: string | number;
  CreatedDate?: string;
}
