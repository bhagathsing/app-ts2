import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators,AbstractControl } from '@angular/forms';
import { DataService } from '../service/DataService';
import { Ng2Storage } from '../service/storage';
import { ILogin } from '../app.interface';
import { Subscription} from 'rxjs/Subscription';
import { ConfirmComponent } from '../common/confirm/confirm.component';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(ConfirmComponent) public confirmModal: ConfirmComponent;
  public loginForm: FormGroup;
  public confirmPopupData:any;
  private loginFormModel:ILogin = {
    userId:undefined,
    password:undefined
  };
  public formErrors:ILogin = {
    userId:'',
    password:''
  }
  public isLogin:boolean = false;
  public busy:Subscription;

  constructor(
    private router:Router, 
    private fb: FormBuilder,
    private authService:DataService,
    private storage:Ng2Storage,
    private commonService: CommonService
    ) {
  }

  public ngOnInit() {
    this.confirmPopupData =  this.commonService.setConfirmOptions('Error','You are not autherised. Please contact RMG Team','Ok','--','danger');
    let metaData = this.storage.getSession('user_data');
    if(metaData && metaData.userRoleName.toLocaleLowerCase() === 'reviewer'){
     this.router.navigate(['/app/superviser']);
    }else{
      this.router.navigate(['/app/userview']);
    }
    this.formBuilder();
  }

  private formBuilder(){
    this.loginForm = this.fb.group({
      userId:[
          this.loginFormModel.userId,
          [
              Validators.required
          ]
      ],
      password:[
          this.loginFormModel.password,
          [
              Validators.required
          ]
      ]
    });
    this.loginForm.valueChanges.subscribe(data => this.onValuesChanged(data));
    this.onValuesChanged();
  }

  public onLogin(){
    
    if(this.loginForm.valid) {
      this.loginFormModel = this.loginForm.value;  
      this.busy = this.authService.loginUser(this.loginFormModel).subscribe((data)=>{
        this.isLogin = false;
        if(data.employeeId){
          if(data.employeeRoleName.toLocaleLowerCase() == 'reviewer'){
            this.router.navigate(['/app/superviser/record']);
          }else{
            this.router.navigate(['/app/userview/record']);
          }
        }else{
          this.confirmModal.show(null)
          .then((): void => {
          }).catch(()=>{
          })
        }
      },(err)=>{
      //  console.log('ERROR',err);
      //    this.confirmPopupData =  this.commonService.setConfirmOptions('Error','Something Error while login','Ok','--','danger');
      //    this.confirmModal.show('yes')
      //    .then((): void => {
      //    }).catch(()=>{
      //    })
       this.isLogin = true;
      })
    }else{
      this.storage.removeSession('user_data');
      this.storage.clearAllSession();
    }
  }
  public validationMessages = {
    'userId': {
      'required':  'Name is required.'
    },
    'password':{
      'required':  'Password is required.'
    }
  }

  public onValuesChanged(data?: any) {
      this.isLogin = false;
      if (!this.loginForm) { return; }
      const form = this.loginForm;
      for (const field in this.formErrors) {
        this.formErrors[field] = '';
        const control = form.get(field);
  
        if (control && control.invalid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
  }
  
}
