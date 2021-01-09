import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProjectComponent } from './confirm-project.component';

describe('ConfirmProjectComponent', () => {
  let component: ConfirmProjectComponent;
  let fixture: ComponentFixture<ConfirmProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
