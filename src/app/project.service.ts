import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Project } from './interface/project.interface';

@Injectable({
    providedIn: "root"
})
export class ProjectService {
  constructor(
    private http: HttpClient
  ) { }

  submitProject(project: Project) {
    return this.http.post("https://localhost:44331/api/Project", JSON.stringify(project), {
      headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        }
      );
  }

  uploadProjectDocument(documents: FormData) {
    return this.http.post("https://localhost:44331/api/ProjectDocument", documents);
  }

  getIncompletedProjects() {
    return this.http.get("https://localhost:44331/api/Project", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      params: new HttpParams().set("type", "1")
    });
  }

  getById(projectId: number) {
    let params = new HttpParams().set("id", projectId.toString());

    return this.http.get("https://localhost:44331/api/Project", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      params: params
    })
  }

  confirmProject(Id: number, UserId: number) {
    return this.http.get("https://localhost:44331/api/Project/ConfirmProject", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      params: new HttpParams().set("Id", Id.toString()).set("UserId", UserId.toString())
    })
  }
}
