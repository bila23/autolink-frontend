import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallerSolicitudComponent } from './taller-solicitud.component';

describe('TallerSolicitudComponent', () => {
  let component: TallerSolicitudComponent;
  let fixture: ComponentFixture<TallerSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallerSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
