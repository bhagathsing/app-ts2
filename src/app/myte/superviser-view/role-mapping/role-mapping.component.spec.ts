import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMappingComponent } from './role-mapping.component';

describe('RoleMappingComponent', () => {
  let component: RoleMappingComponent;
  let fixture: ComponentFixture<RoleMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
