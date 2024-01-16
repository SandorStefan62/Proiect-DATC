import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateuserPage } from './createuser.page';

describe('CreateuserPage', () => {
  let component: CreateuserPage;
  let fixture: ComponentFixture<CreateuserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
