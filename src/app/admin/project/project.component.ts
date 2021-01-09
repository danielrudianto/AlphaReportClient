import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../project.service';
import { Project } from '../../interface/project.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  isFetchingProject: boolean;
  constructor(
    public router: Router,
    private projectService: ProjectService,
  ) {
    this.isFetchingProject = false;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Project>;

  displayedColumns: string[] = ["Name", "Address", "Client", "Status", "Action"];
  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects() {
    this.isFetchingProject = true;
    this.projectService.getIncompletedProjects().subscribe((responseData: Project[]) => {
      this.dataSource = new MatTableDataSource(responseData);
      this.isFetchingProject = false;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  viewProject(projectId: number) {
    this.router.navigate(["/Admin/Project/View/" + projectId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
