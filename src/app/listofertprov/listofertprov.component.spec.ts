import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofertprovComponent } from './listofertprov.component';

describe('ListofertprovComponent', () => {
  let component: ListofertprovComponent;
  let fixture: ComponentFixture<ListofertprovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListofertprovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListofertprovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
