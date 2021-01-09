import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../user.service';
import { User, Position } from '../../interface/user.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isFetchingUsers: boolean = false;
  users: User[];
  search: string;

  displayedColumns: string[] = ["Name", "Email", "Position", "Status", "Actions"];
  displayedPositionColumns: string[] = ["Name", "Current Position", "Pending Position", "Actions"];
  dataSource = new MatTableDataSource();

  constructor(
    private userService: UserService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.isFetchingUsers = true;
    this.userService.getUsers().subscribe((responseData: User[]) => {
      responseData.forEach((user: User) => {
        user.PendingPositions = user.Positions.filter(x => new Date(x.EffectiveDate) > new Date());
      });

      this.users = responseData;
      this.dataSource = new MatTableDataSource(responseData);

      this.isFetchingUsers = false;
    })
  }

  openAddPosition(row: User) {
    const dialog = this._dialog.open(CreateUserPositionComponent, {
      data: row
    });

    dialog.afterClosed().subscribe((data: User) => {
      this.users[this.users.indexOf(this.users.filter(x => x.Id == data.Id)[0], 0)] = data;
      this.users.forEach((user: User) => {
        user.PendingPositions = user.Positions.filter(x => new Date(x.EffectiveDate) > new Date());
      });
      this.dataSource = new MatTableDataSource(this.users);
    })
  }

  applyFilter(event: any) {
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewPositions(user: User) {
    const dialog = this._dialog.open(ViewUserPositionComponent, {
      data: user
    });

    dialog.afterClosed().subscribe((data: User) => {
      console.log(data);
      this.users[this.users.indexOf(this.users.filter(x => x.Id == data.Id)[0], 0)] = data;
      this.users.forEach((user: User) => {
        user.PendingPositions = user.Positions.filter(x => new Date(x.EffectiveDate) > new Date());
      });
      this.dataSource = new MatTableDataSource(this.users);
    })
  }

  openBottomSheet() {
    const dialogRef = this._dialog.open(CreateUserComponent);
    dialogRef.afterClosed().subscribe((data: User) => {
      if (data != null) {
        this.users.push(data);
        this.dataSource = new MatTableDataSource(this.users);
      }
      
    })
  }

  confirmDeleteUser(user: User) {
    const dialogRef = this._dialog.open(DeleteUserComponent, {
      data: user,
      position: { bottom: '0' }
    });

    dialogRef.afterClosed().subscribe((data: number) => {
      if (data == 1) {
        this.users[this.users.indexOf(this.users.filter(x => x.Id == user.Id)[0], 0)].IsActive = 0;
        this.users.forEach((user: User) => {
          user.PendingPositions = user.Positions.filter(x => new Date(x.EffectiveDate) > new Date());
        });
        this.dataSource = new MatTableDataSource(this.users);
      }
    })
  }

  confirmEnableUser(user: User) {
    const dialogRef = this._dialog.open(EnableUserComponent, {
      data: user,
      position: { bottom: '0' }
    });

    dialogRef.afterClosed().subscribe((data: number) => {
      if (data == 1) {
        this.users[this.users.indexOf(this.users.filter(x => x.Id == user.Id)[0], 0)].IsActive = 1;
        this.users.forEach((user: User) => {
          user.PendingPositions = user.Positions.filter(x => new Date(x.EffectiveDate) > new Date());
        });
        this.dataSource = new MatTableDataSource(this.users);
      }
    })
  }

  confirmEditUser(user: User) {
    const dialogRef = this._dialog.open(EditUserComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe((data: User) => {
      this.users[this.users.indexOf(this.users.filter(x => x.Id == data.Id)[0], 0)] = data;
      this.users.forEach((user: User) => {
        user.PendingPositions = user.Positions.filter(x => new Date(x.EffectiveDate) > new Date());
      });
      this.dataSource = new MatTableDataSource(this.users);
    })
  }

}

@Component({
  selector: 'view-user-position',
  templateUrl: 'view-user-position.html',
})
export class ViewUserPositionComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialogRef: MatDialogRef<ViewUserPositionComponent>,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User 
  ) { }

  dataSource = this.data.Positions;

  deletePosition(id: number) {
    this.userService.deletePosition(id).subscribe((responseData: User) => {
      if (responseData != null) {
        this._snackBar.open("Successfully delete user position", "Close", {
          duration: 2000
        });
        this._dialogRef.close(responseData);
      } else {
        this._snackBar.open("Failed to delete user position", "Close", {
          duration: 2000
        })
      }
    })
  }
}

@Component({
  selector: 'create-user-position',
  templateUrl: 'create-user-position.html',
})
export class CreateUserPositionComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialogRef: MatDialogRef<CreateUserPositionComponent>,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

  dataSource = this.data;

  positionForm: FormGroup = new FormGroup({
    Position: new FormControl("", Validators.required),
    EffectiveDate: new FormControl("", Validators.required)
  });
  createUserPosition() {
    var userPosition: Position = this.positionForm.value;
    userPosition.UserId = this.dataSource.Id;
    userPosition.Id = 0;

    this.userService.insertPosition(userPosition).subscribe((responseData: User) => {
      if (responseData != null) {
        this._dialogRef.close(responseData);
        this._snackBar.open("Successfully insert data", "Close", {
          duration: 2000
        });
      } else {
        this._snackBar.open("Failed to insert data", "Close", {
          duration: 2000
        })
      }
    })
  }
}

@Component({
  selector: 'create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialogRef: MatDialogRef<CreateUserComponent>,
    private userService: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  addUserForm: FormGroup = new FormGroup({
    FirstName: new FormControl("", Validators.required),
    LastName: new FormControl(""),
    Email: new FormControl("", [Validators.required, Validators.email]),
    Password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    Position: new FormControl(1, Validators.required)
  });

  createUser() {
    var user = this.addUserForm.value;
    this.userService.insertUser(user).subscribe((responseData: User) => {
      if (responseData != null) {
        this._snackBar.open("Successfully insert data", "Close", {
          duration: 2000
        })
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
  selector: 'delete-user',
  templateUrl: 'delete-user.html',
})
export class DeleteUserComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User 
  ) { }

  dataSource = this.data;

  deleteUser() {
    this.userService.deleteUser(this.data.Id).subscribe((responseData: number) => {
      if (responseData == 1) {
        this._snackBar.open("Successfully delete user", "Close", {
          duration: 2000
        });

        this._dialogRef.close(1);
      } else {
        this._snackBar.open("Failed to delete user", "Close", {
          duration: 2000
        });
      }
    })
  }
}

@Component({
  selector: 'enable-user',
  templateUrl: 'enable-user.html',
})
export class EnableUserComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialogRef: MatDialogRef<EnableUserComponent>,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }
  dataSource = this.data;
  enableUser() {
    this.userService.enableUser(this.data.Id).subscribe((responseData: number) => {
      if (responseData == 1) {
        this._snackBar.open("Successfully enable user", "Close", {
          duration: 2000
        });

        this._dialogRef.close(1);
      } else {
        this._snackBar.open("Failed to enable user", "Close", {
          duration: 2000
        });
      }
    })
  }
}

@Component({
  selector: 'edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserComponent {
  isSubmitting: boolean = false;
  constructor(
    private _dialogRef: MatDialogRef<CreateUserComponent>,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User 
  ) { }

  dataSource = this.data;
  todayDate = new Date();

  selectedPosition = this.dataSource.Position;
  editUserForm: FormGroup = new FormGroup({
    FirstName: new FormControl(this.dataSource.FirstName, Validators.required),
    LastName: new FormControl(this.dataSource.LastName),
    Email: new FormControl(this.dataSource.Email, [Validators.required, Validators.email]),
  });

  updateUser() {
    this.isSubmitting = true;
    var user = this.editUserForm.value;
    this.userService.updateUser(user).subscribe((responseData: User) => {
      if (responseData != null) {
        this._snackBar.open("Successfully update user", "Close", {
          duration: 2000
        })
        this._dialogRef.close(responseData);
      } else {
        this._snackBar.open("Failed to update user", "Close", {
          duration: 2000
        })
      }
      
      this.isSubmitting = false;
    })
  }
}
