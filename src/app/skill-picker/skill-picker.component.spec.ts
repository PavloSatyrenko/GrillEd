import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillPickerComponent } from './skill-picker.component';

describe('SkillPickerComponent', () => {
  let component: SkillPickerComponent;
  let fixture: ComponentFixture<SkillPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
