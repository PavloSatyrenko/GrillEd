import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEditingComponent } from './course-editing.component';

describe('CourseEditingComponent', () => {
  let component: CourseEditingComponent;
  let fixture: ComponentFixture<CourseEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseEditingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
