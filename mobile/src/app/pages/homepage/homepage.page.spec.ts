import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomepagePage } from './homepage.page';

describe('HomepagePage', () => {
  let component: HomepagePage;
  let fixture: ComponentFixture<HomepagePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(HomepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
