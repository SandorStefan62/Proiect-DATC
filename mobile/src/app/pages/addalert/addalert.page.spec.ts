import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddalertPage } from './addalert.page';

describe('AddalertPage', () => {
  let component: AddalertPage;
  let fixture: ComponentFixture<AddalertPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddalertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
