import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardByStatusComponent } from './board-by-status.component';

describe('BoardByStatusComponent', () => {
  let component: BoardByStatusComponent;
  let fixture: ComponentFixture<BoardByStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardByStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
