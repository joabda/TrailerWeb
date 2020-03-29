import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingpurchaseComponent } from './streamingpurchase.component';

describe('StreamingpurchaseComponent', () => {
  let component: StreamingpurchaseComponent;
  let fixture: ComponentFixture<StreamingpurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamingpurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamingpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
