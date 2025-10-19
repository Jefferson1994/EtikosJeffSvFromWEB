import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesbloquearBloquearUserComponent } from './desbloquear-bloquear-user.component';

describe('DesbloquearBloquearUserComponent', () => {
  let component: DesbloquearBloquearUserComponent;
  let fixture: ComponentFixture<DesbloquearBloquearUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesbloquearBloquearUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesbloquearBloquearUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
