import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Autentificacion2faComponent } from './autentificacion2fa.component';

describe('Autentificacion2faComponent', () => {
  let component: Autentificacion2faComponent;
  let fixture: ComponentFixture<Autentificacion2faComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autentificacion2faComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Autentificacion2faComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
