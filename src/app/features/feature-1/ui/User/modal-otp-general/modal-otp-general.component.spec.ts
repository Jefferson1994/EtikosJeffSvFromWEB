import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOtpGeneralComponent } from './modal-otp-general.component';

describe('ModalOtpGeneralComponent', () => {
  let component: ModalOtpGeneralComponent;
  let fixture: ComponentFixture<ModalOtpGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalOtpGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalOtpGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
