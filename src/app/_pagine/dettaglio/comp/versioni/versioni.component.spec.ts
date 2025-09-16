import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersioniComponent } from './versioni.component';

describe('VersioniComponent', () => {
  let component: VersioniComponent;
  let fixture: ComponentFixture<VersioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersioniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
