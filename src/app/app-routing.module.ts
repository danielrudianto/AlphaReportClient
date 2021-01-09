import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './admin/project/project.component';
import { ConfirmProjectComponent } from './admin/project/confirm-project/confirm-project.component';
import { CreateProjectComponent } from './admin/project/create-project/create-project.component';
import { ViewProjectComponent } from './admin/project/view-project/view-project.component';
import { ViewProjectDetailComponent } from './admin/project/view-project-detail/view-project-detail.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ClientComponent } from './admin/client/client.component';
import { UserComponent } from './admin/user/user.component';
import { AuthGuardService } from './auth-guard.service';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: "Admin", component: AdminComponent, children: [
    {
      path: "Project", component: ProjectComponent, children:
        [
          { path: "Create", component: CreateProjectComponent },
          { path: "Confirm", component: ConfirmProjectComponent },
          { path: "View", component: ViewProjectComponent },
          { path: "View/:id", component: ViewProjectDetailComponent }
        ]
    },
    { path: "Client", component: ClientComponent },
    { path: "User", component: UserComponent }
  ]
  },
  { path: "", component: AppComponent, canActivate: [AuthGuardService] },
  { path: "Login", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
