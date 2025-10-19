import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpRecuperarContraseniaComponent } from './otp-recuperar-contrasenia.component';

describe('OtpRecuperarContraseniaComponent', () => {
  let component: OtpRecuperarContraseniaComponent;
  let fixture: ComponentFixture<OtpRecuperarContraseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpRecuperarContraseniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpRecuperarContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
