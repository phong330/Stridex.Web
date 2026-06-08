import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichsuDonhang } from './lichsu-donhang';

describe('LichsuDonhang', () => {
  let component: LichsuDonhang;
  let fixture: ComponentFixture<LichsuDonhang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LichsuDonhang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LichsuDonhang);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
