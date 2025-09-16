import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebolezzeComponent } from './debolezze.component';

describe('DebolezzeComponent', () => {
  let component: DebolezzeComponent;
  let fixture: ComponentFixture<DebolezzeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebolezzeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebolezzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
