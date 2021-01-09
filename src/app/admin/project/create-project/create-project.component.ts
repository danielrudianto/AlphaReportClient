import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ClientService } from '../../../client.service';
import { Client } from '../../../interface/client.interface';
import { Project } from '../../../interface/project.interface';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { CookieService } from 'ngx-cookie-service';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

import { ProjectService } from '../../../project.service';
import { UserService } from '../../../user.service';

import { User, ProjectUser } from '../../../interface/user.interface';
import { Task, ProjectItem } from '../../../interface/task.interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  clients: Client[] = [];
  client: Client;
  generalFormGroup: FormGroup;
  clientFormGroup: FormGroup;
  taskFormGroup: FormGroup;
  userFormGroup: FormGroup;

  isLoading: boolean;
  isUploading: boolean;

  projectDuration: number = null;
  projectTimeline: number = null;

  projectName: string;
  projectDocument: string;

  users: ProjectUser[] = [];
  usersSelected: ProjectUser[] = [];
  tasks: Task[] = [];
  formTasks: Task[] = [];
  projectFile: FormControl;

  isFetchingClient: boolean = false;
  displayedTaskColumns: string[] = [];
  displayedColumns: string[] = ["Name", "Address", "City", "Phone Number", "Actions"];
  displayedDocumentColumns: string[] = ["Name", "Actions"];

  dateColumn: number[];

  dataSource = new MatTableDataSource();
  documentDataSource = new MatTableDataSource();
  treeControl = new NestedTreeControl<Task>(node => node.Children);
  taskDataSource = new MatTreeNestedDataSource<Task>();
  header: boolean = true;
  csvRecords: any[] = [];
  public files;
  documents: File[] = [];
  projectAddress: string = '';

  @ViewChild("stepper") stepper: MatStepper;
  @ViewChild("document") document: ElementRef;
  
  constructor(
    private clientService: ClientService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ngxCsvParser: NgxCsvParser,
    private cookieService: CookieService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.projectFile = new FormControl(this.files, Validators.required);
  }

  ngOnInit(): void {
    this.isFetchingClient = true;
    this.clientService.getClients().subscribe((responseData: Client[]) => {
      this.clients = responseData;
      this.dataSource = new MatTableDataSource(responseData);
      this.isFetchingClient = false;
      this.isLoading = false;
      this.isUploading = false;
      this.documents = [];
    });

    this.userService.getUsers().subscribe((responseData: User[]) => {
      var userProject = [];
      responseData.forEach(user => {
        var projectUser: ProjectUser = {
          UserId: user.Id,
          User: user,
          Position: null
        }

        userProject.push(projectUser);
      })

      this.users = userProject;
    })

    this.tasks = [];
    this.formTasks = [];

    this.taskDataSource.data = this.tasks;

    this.generalFormGroup = this._formBuilder.group({
      Name: new FormControl("", Validators.required),
      Document: new FormControl("", Validators.required),
      Address: new FormControl("", Validators.required)
    });

    this.clientFormGroup = this._formBuilder.group({
      ClientId: new FormControl("", Validators.required)
    });

    this.projectFile.valueChanges.subscribe((files: any) => {
      this.displayedTaskColumns = ["Task"];
      this.ngxCsvParser.parse(files, { header: this.header, delimiter: ';' }).pipe().subscribe((result: Array<ProjectItem>) => {
        this.tasks = this.list_to_tree(result);
        this.refreshTreeData();
      });
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  list_to_tree(list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i ++) {
      map[list[i].Id] = i;
      list[i].Children = [];
    }

    var end = 0;

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (this.projectTimeline == null || node.Timeline < this.projectTimeline) {
        this.projectTimeline = node.Timeline;
      }

      if (node.ParentId != "" && node.ParentId != null) {
        if (list[map[node.ParentId]].Children.length == 0) {
          list[map[node.ParentId]].Price = 0;
          list[map[node.ParentId]].BudgetPrice = 0;
          list[map[node.ParentId]].EstimatedDuration = null;
          list[map[node.ParentId]].Timeline = null;
          list[map[node.ParentId]].Quantity = null;
          list[map[node.ParentId]].End = null;
          list[map[node.ParentId]].Unit = null;

          node.Timeline = parseInt(node.Timeline);
          node.EstimatedDuration = parseInt(node.EstimatedDuration);
          var taskTimeline = node.Timeline;
          var taskDuration = node.EstimatedDuration;
          var taskEnd = taskDuration + taskTimeline;

          for (var y = taskTimeline; y < taskEnd; y++) {
            node[y] = node.Price / node.EstimatedDuration;
          }
        }

        list[map[node.ParentId]].Children.push(node);
        list[map[node.ParentId]].Children.sort((a, b) => a.Timeline.localeCompare(b.Timeline));
        list[map[node.ParentId]].Price += (node.Price * node.Quantity);
        list[map[node.ParentId]].BudgetPrice += (node.BudgetPrice * node.Quantity);

        var duration = 0; 
        if (list[map[node.ParentId]].Children.length > 0) {
          duration = this.getMaximumDuration(list[map[node.ParentId]].Children);
        }
        
        var start = parseInt(node.Timeline);

        if (end < (start + duration)) {
          end = (start + duration);
          node.End = start + duration;
        }

        if (list[map[node.ParentId]].Timeline == null || list[map[node.ParentId]].Timeline > start) {
          list[map[node.ParentId]].Timeline = start;
        }

        if (list[map[node.ParentId]].EstimatedDuration == null || (list[map[node.ParentId]].EstimatedDuration < duration && list[map[node.ParentId]].EstimatedDuration != 0)) {
          list[map[node.ParentId]].EstimatedDuration = duration;
        }

        if (list[map[node.ParentId]].End == null || (list[map[node.ParentId]].End < (start + duration) && list[map[node.ParentId]].EstimatedDuration != 0)) {
          list[map[node.ParentId]].End = start + duration;
        }
      } else {
        if (node.Children.length == 0) {
          node.End = parseInt(node.Timeline) + parseInt(node.EstimatedDuration);
        }
        roots.push(node);
      }
    }

    this.projectDuration = end - this.projectTimeline;
    this.dateColumn = [];
    for (var x = 0; x <= end; x++) {
      this.dateColumn.push(x);
      this.displayedTaskColumns.push(String(x));
    }
    this.formTasks = list;
    return roots;
  }

  getMaximumDuration(node: any[]) {
    var maxEnd = 0;
    var minEnd;
    node.forEach((item) => {
      var Duration = parseInt(item.EstimatedDuration);
      var Timeline = parseInt(item.Timeline);
      if ((Duration + Timeline) > maxEnd) {
        maxEnd = Duration + Timeline;
      }

      if (minEnd == null || Timeline < minEnd) {
        minEnd = Timeline;
      }
    })

    return (maxEnd - minEnd);
  }

  uploadFile(event: Event) {
    var element = event.currentTarget as HTMLInputElement;
    var fileList: FileList | null = element.files;
    if (fileList) {
      this.documents.push(fileList[0]);
      this.document.nativeElement.value = '';
    }

    this.documentDataSource.data = null;
    this.documentDataSource.data = this.documents;
  }

  downloadProjectFormat() {
    window.open('/assets/ProjectFormat.csv', '_blank');
  }

  deleteFile(i: File) {
    var indexFileToBeDeleted = this.documents.indexOf(i);
    this.documentDataSource.data = null;
    this.documentDataSource.data = this.documents;
    this.documents.splice(indexFileToBeDeleted, 1);
  }

  refreshTreeData() {
    const data = this.tasks;
    this.taskDataSource.data = null;
    this.taskDataSource.data = data;
  }

  hasChild = (_: number, node: Task) => node.Children.length > 0;

  submitForm() {
    this.isLoading = true;
    var project: Project = {
      Name: this.projectName,
      Address: this.projectAddress,
      DocumentName: this.projectDocument,
      CreatedBy: JSON.parse(this.cookieService.get("user")).Id,
      ClientId: this.client.Id,
      Tasks: this.formTasks,
      Documents: [],
      Users: this.usersSelected,
      ConfirmedBy: null
    }

    this.projectService.submitProject(project).subscribe((responseData: number) => {
      if (responseData != 0) {
        if (this.documents.length > 0) {
          this.isUploading = true;
          var formData = new FormData();
          formData.append("CreatedBy", JSON.parse(this.cookieService.get("user")).Id);
          formData.append("CodeProjectId", responseData.toString());
          this.documents.forEach((document, index) => {
            formData.append(index.toString(), document);
          });

          this.projectService.uploadProjectDocument(formData).subscribe(() => {
            this.isLoading = false;
            this.isUploading = false;
          });
        } else {
          this.isLoading = false;
        }

        this.snackBar.open("Successfully create project", "Close", {
          duration: 2000
        });

        this.refreshForm();
      } else {
        this.isLoading = false;
        this.snackBar.open("Failed to create project", "Close", {
          duration: 2000
        })
      }
    })
  }

  refreshForm() {
    this.generalFormGroup.reset();
    this.clientFormGroup.reset();

    this.documentDataSource.data = null;
    this.tasks = [];
    this.client = null;
    this.documents = [];
    this.stepper.reset();
  }
}
