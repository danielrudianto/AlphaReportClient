import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../../project.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../interface/project.interface';
import { MatAccordion } from '@angular/material/expansion';
import { Task } from '../../../interface/task.interface';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatTreeFlatDataSource } from '@angular/material/tree';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-view-project-detail',
  templateUrl: './view-project-detail.component.html',
  styleUrls: ['./view-project-detail.component.css']
})
export class ViewProjectDetailComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  tasks: Task[];
  dataSource;
  projectTimeline: number = null;
  projectDuration: number = null;
  treeControl = new NestedTreeControl<Task>(node => node.Children);
  taskDataSource = new MatTreeNestedDataSource<Task>();
  dateColumn: number[];
  displayedTaskColumns: string[] = [];

  constructor(
    private projectService: ProjectService,
    private router: ActivatedRoute,
    private cookieService: CookieService
  ) { }

  projectId: number;
  project: Project;

  ngOnInit(): void {
    this.projectId = parseInt(this.router.snapshot.paramMap.get("id"));
    this.projectService.getById(this.projectId).subscribe((responseData: Project) => {
      this.project = responseData;
      this.tasks = this.list_to_tree(this.project.Tasks);
      this.taskDataSource.data = this.tasks;
    })
  }

  list_to_tree(list) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < list.length; i++) {
      map[list[i].Id] = i;
      list[i].Children = [];
      list[i].End = parseInt(list[i].Timeline) + parseInt(list[i].EstimatedDuration);
    }

    var end = 0;

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (this.projectTimeline == null || node.Timeline < this.projectTimeline) {
        this.projectTimeline = node.Timeline;
      }

      if (node.ParentId != "" && node.ParentId != null) {
        var parentId = parseInt(node.ParentId);;
        if (list[map[node.ParentId]].Children.length == 0) {
          list[map[node.ParentId]].Price = 0;
          list[map[node.ParentId]].BudgetPrice = 0;
          list[map[node.ParentId]].EstimatedDuration = null;
          list[map[node.ParentId]].Timeline = null;
          list[map[node.ParentId]].Quantity = null;
          list[map[node.ParentId]].End = null;

          node.Timeline = parseInt(node.Timeline);
          node.Duration = parseInt(node.EstimatedDuration);
          var taskTimeline = node.Timeline;
          var taskDuration = node.EstimatedDuration;
          var taskEnd = taskDuration + taskTimeline;

          for (var y = taskTimeline; y < taskEnd; y++) {
            node[y] = node.Price / node.EstimatedDuration;
          }
        }
        list[map[node.ParentId]].Children.push(node);
        try {
          list[map[node.ParentId]].Children.sort((a, b) => a.Timeline.localeCompare(b.Timeline));
        } catch (err) {

        }
        
        list[map[node.ParentId]].Price += parseFloat(node.Price);
        list[map[node.ParentId]].BudgetPrice += parseFloat(node.BudgetPrice);

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
  hasChild = (_: number, node: Task) => node.Children.length > 0;

  confirmProject() {
    var UserId = parseInt(JSON.parse(this.cookieService.get("user")).Id);
    var Id = this.project.Id
    this.projectService.confirmProject(Id, UserId).subscribe((responseData: number) => {
      this.project = null;
      this.projectService.getById(this.projectId).subscribe((responseData: Project) => {
        this.project = responseData;
        this.tasks = this.list_to_tree(this.project.Tasks);
        this.taskDataSource.data = this.tasks;
      })
      if (responseData == 1) {

      }
    })
  }
}
