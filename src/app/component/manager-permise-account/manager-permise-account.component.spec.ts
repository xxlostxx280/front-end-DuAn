import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPermiseAccountComponent } from './manager-permise-account.component';

describe('ManagerPermiseAccountComponent', () => {
  let component: ManagerPermiseAccountComponent;
  let fixture: ComponentFixture<ManagerPermiseAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerPermiseAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPermiseAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
