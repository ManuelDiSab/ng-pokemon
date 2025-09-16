import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvoluzioniComponent } from './evoluzioni.component';

describe('EvoluzioniComponent', () => {
  let component: EvoluzioniComponent;
  let fixture: ComponentFixture<EvoluzioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvoluzioniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvoluzioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
