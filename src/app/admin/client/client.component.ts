import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { ClientService } from '../../client.service';
import { Client, ClientContact } from '../../interface/client.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})

export class ClientComponent implements OnInit {
  clients: Client[];
  contacts: ClientContact[];
  isFetchingClient: boolean;
  expandedContact: Client = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ["Name", "Address", "City", "Phone Number", "Contacts", "Actions"];
  dataSource = new MatTableDataSource();

  constructor(
    private clientService: ClientService,
    private _bottomSheet: MatBottomSheet,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getClients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getClients() {
    this.isFetchingClient = true;
    this.clientService.getClients().subscribe((responseData: Client[]) => {
      this.dataSource = new MatTableDataSource(responseData);
      this.clients = responseData;
      this.isFetchingClient = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewContacts(Id: number) {
    this.contacts = this.clients.filter((x: Client) => x.Id == Id)[0].Contacts;
    this._dialog.open(ViewContactClientComponent, {
      data: this.clients.filter((x: Client) => x.Id == Id)[0],
      panelClass: 'full-panel-width'
    });    
  }

  openBottomSheet(): void {
    const dialogRef = this._dialog.open(CreateClientComponent);
    dialogRef.afterClosed().subscribe(
      data => {
        this.clients.push(data);
        this.dataSource = new MatTableDataSource(this.clients);
      }
    )
  }

  confirmDeleteClient(client: Client) {
    const dialogRef = this._dialog.open(DeleteClientComponent, {
      data: client,
      position: { bottom: `0` }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data == 1) {
          this.clients = this.clients.filter(x => x != client);
          this.dataSource = new MatTableDataSource(this.clients);
        }
      }
    )
  }

  confirmEditClient(client: Client) {
    const dialogRef = this._dialog.open(EditClientComponent, {
      data: client
    });

    dialogRef.afterClosed().subscribe(
      data => {
        this.clients[this.clients.indexOf(this.clients.filter(x => x.Id == data.Id)[0], 0)] = data;
        this.dataSource = new MatTableDataSource(this.clients);
      })
  }
}

@Component({
  selector: 'edit-client',
  templateUrl: 'edit-client.html',
})
export class EditClientComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialogRef: MatDialogRef<EditClientComponent>,
    private clientService: ClientService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) { }

  dataSource = this.data;

  editClientForm: FormGroup = new FormGroup({
    Name: new FormControl(this.dataSource.Name, Validators.required),
    Address: new FormControl(this.dataSource.Address, [Validators.required, Validators.minLength(10)]),
    City: new FormControl(this.dataSource.City, Validators.required),
    PhoneNumber: new FormControl(this.dataSource.PhoneNumber, Validators.required),
    TaxIdentificationNumber: new FormControl(this.dataSource.TaxIdentificationNumber)
  });

  updateClient() {
    var value = this.editClientForm.value;
    value.Id = this.data.Id;
    this.clientService.updateClient(value).subscribe((responseData: Client) => {
      if (responseData != null) {
        this._snackBar.open("Successfully update data", "Close", {
          duration: 2000
        });
        this._dialogRef.close(responseData);
      } else {
        this._snackBar.open("Failed to update data", "Close", {
          duration: 2000
        })
      }
    })
  }
}

@Component({
  selector: 'create-client',
  templateUrl: 'create-client.html',
})
export class CreateClientComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialogRef: MatDialogRef<CreateClientComponent>,
    private clientService: ClientService,
    private _snackBar: MatSnackBar
  ) { }

  addClientForm: FormGroup = new FormGroup({
    Name: new FormControl("", Validators.required),
    Address: new FormControl("", [Validators.required, Validators.minLength(10)]),
    City: new FormControl("", Validators.required),
    PhoneNumber: new FormControl("", Validators.required),
    TaxIdentificationNumber: new FormControl("")
  });

  submitClient() {
    this.isSubmitting = true;
    this.clientService.insertItem(this.addClientForm.value).subscribe((responseData: Client) => {
      if (responseData != null) {
        this._snackBar.open("Successfully insert data", "Close", {
          duration: 2000
        });

        this._dialogRef.close(responseData);
      } else {
        this._snackBar.open("Failed to insert data", "Close", {
          duration: 2000
        })
      }
    })
  }
}

@Component({
  selector: 'view-contact-client',
  templateUrl: 'view-contact-client.html',
})
export class ViewContactClientComponent {
  constructor(
    private _dialogRef: MatDialogRef<ViewContactClientComponent>,
    private clientService: ClientService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) { }

  isCreate: boolean = false;
  isEdit: boolean = false;
  isDelete: boolean = false;

  deletedContact: ClientContact;
  dataSource = this.data.Contacts;
  isSubmitting: boolean = false;
  editId: number;

  addContactForm: FormGroup = new FormGroup({
    Name: new FormControl("", Validators.required),
    Position: new FormControl("", Validators.required),
    PhoneNumber: new FormControl("", Validators.required),
    Email: new FormControl("", Validators.email)
  });

  editContactForm: FormGroup = new FormGroup({
    Name: new FormControl("", Validators.required),
    Position: new FormControl("", Validators.required),
    PhoneNumber: new FormControl("", Validators.required),
    Email: new FormControl("", Validators.email)
  })

  submitContact() {
    var value = this.addContactForm.value;
    this.isSubmitting = true;
    value.ClientId = this.data.Id;
    this.clientService.addContact(value).subscribe((responseData: number) => {
      if (responseData == 1) {
        this._snackBar.open("Successfully add contact", "Close", {
          duration: 2000
        });
        this._dialogRef.close();
      } else {
        this._snackBar.open("Failed to add contact", "Close", {
          duration: 2000
        })
      }

      this.isSubmitting = false;
    })
  }

  toggleForm() {
    this.isCreate = !this.isCreate;
  }

  openEditContactForm(contact: ClientContact) {
    this.isEdit = true;
    this.editId = contact.Id;
    this.editContactForm.setValue({
      Name: contact.Name,
      Position: contact.Position,
      PhoneNumber: contact.PhoneNumber,
      Email: contact.Email
    });
  }

  openDeleteContactForm(contact: ClientContact) {
    this.isDelete = true;
    this.deletedContact = contact;
  }

  deleteContact() {
    this.clientService.deleteContact(this.deletedContact.Id).subscribe((responseData: number) => {
      if (responseData == 1) {
        this._snackBar.open("Successfully delete data", "Close", {
          duration: 2000
        });
        this._dialogRef.close();
      } else {
        this._snackBar.open("Failed to delete data", "Close", {
          duration: 2000
        })
      }
    })
  }

  submitUpdateContact() {
    var value = this.editContactForm.value;
    value.Id = this.editId;
    this.isSubmitting = true;
    value.ClientId = this.data.Id;
    this.clientService.updateContact(value).subscribe((responseData: number) => {
      if (responseData == 1) {
        this._snackBar.open("Successfully update contact", "Close", {
          duration: 2000
        });
        this._dialogRef.close();
      } else {
        this._snackBar.open("Failed to update contact", "Close", {
          duration: 2000
        })
      }

      this.isSubmitting = false;
    })
  }
}

@Component({
  selector: 'delete-client',
  templateUrl: 'delete-client.html',
})
export class DeleteClientComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialog: MatDialogRef<DeleteClientComponent>,
    private clientService: ClientService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Client
  ) { }

  
  dataSource = this.data;
  deleteClient() {
    this.clientService.deleteClient(this.dataSource.Id).subscribe((responseData: number) => {
      if (responseData == 1) {
        this._snackBar.open("Successfully delete data", "Close", {
          duration: 2000
        });
        this._dialog.close(1);
      } else {
        this._snackBar.open('Failed to delete data', "Close", {
          duration :2000
        })
      }
    })
  }
};
