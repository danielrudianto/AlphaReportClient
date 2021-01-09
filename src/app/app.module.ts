import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { AppComponent } from './app.component';
import { ProjectComponent } from './admin/project/project.component';
import { CreateProjectComponent } from './admin/project/create-project/create-project.component';
import { ConfirmProjectComponent } from './admin/project/confirm-project/confirm-project.component';
import { ViewProjectComponent } from './admin/project/view-project/view-project.component';
import { ViewProjectDetailComponent } from './admin/project/view-project-detail/view-project-detail.component';
import { LoginComponent } from './login/login.component';
import { UserComponent, CreateUserComponent, EditUserComponent, DeleteUserComponent, EnableUserComponent, ViewUserPositionComponent, CreateUserPositionComponent } from './admin/user/user.component';
import { UserProjectComponent } from './admin/user/user-project/user-project.component';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTreeModule } from '@angular/material/tree';
import { ClientComponent, CreateClientComponent, EditClientComponent, ViewContactClientComponent, DeleteClientComponent } from './admin/client/client.component';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    CreateProjectComponent,
    ConfirmProjectComponent,
    ViewProjectComponent,
    ViewProjectDetailComponent,
    LoginComponent,
    UserComponent,
    UserProjectComponent,
    AdminComponent,
    ClientComponent,
    CreateClientComponent,
    EditClientComponent,
    ViewContactClientComponent,
    DeleteClientComponent,
    CreateUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    EnableUserComponent,
    ViewUserPositionComponent,
    CreateUserPositionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    DragDropModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDividerModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatTabsModule,
    FormsModule,
    MatNativeDateModule,
    MatStepperModule,
    MatTreeModule,
    NgxCsvParserModule,
    NgxMatFileInputModule,
  ],
  entryComponents: [
    CreateClientComponent,
    EditClientComponent,
    ViewContactClientComponent,
    DeleteClientComponent,
    CreateUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    EnableUserComponent,
    ViewUserPositionComponent,
    CreateUserPositionComponent,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
