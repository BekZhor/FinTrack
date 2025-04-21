import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsViewComponent } from './analytics-view.component';

describe('AnalyticsViewComponent', () => {
  let component: AnalyticsViewComponent;
  let fixture: ComponentFixture<AnalyticsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
