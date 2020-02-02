import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Headerview2Component } from './headerview2.component';

describe('Headerview2Component', () => {
  let component: Headerview2Component;
  let fixture: ComponentFixture<Headerview2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Headerview2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Headerview2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
