import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../sidenav.service'
import { onSideNavChange, animateText, onMainContentChange } from '../animations/animations';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [onSideNavChange, animateText, onMainContentChange]
})
export class AdminComponent implements OnInit {
  height: number = window.innerHeight;
  toolBarHeight: number;
  containerHeight: number;
  pageTitle: string;
  sideNavState: boolean = false;
  linkText: boolean = false;
  onSideNavChange: boolean;

  routeName: string = "";
  constructor(
    private _sidenavService: SidenavService
  ) {
    this._sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    })
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState)
  }

  ngOnInit(): void {
  }
}
