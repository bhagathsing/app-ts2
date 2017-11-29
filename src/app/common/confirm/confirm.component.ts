import { 
    Component, 
    ViewEncapsulation, 
    ViewChild,
    ElementRef,
    Input, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SaveConfigEmployeeData } from '../../app.interface';

type MessageType = 'success' | 'warning' | 'danger' | 'info';
type ModalSize = 'small' | 'large';

interface IDialogMessage {
    title: string;
    value: string;
    type: MessageType;
}

@Component({
    selector: 'confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class ConfirmComponent implements AfterViewInit {
    @Input() title: string = 'Confirm';
    @Input() message: string = 'Message here';
    @Input() confirmText: string = 'Ok';
    @Input() cancelText: string;
    @Input() value: string = '';
    @Input() size: ModalSize = 'large';
    @Input() type: MessageType = 'info';
    @Input() modalType: string;
    @Input() isCheckBox:string = 'No';
    @Input() disclaimerText:string = '';
    public dataObj:SaveConfigEmployeeData;

    @ViewChild('confirmModal') confirmModal: ModalDirective;

    private sendConfirmResult: () => any;
    private sendCancelResult: () => any;
    public isChecked:boolean = true;
    constructor(private elementRef: ElementRef) {
    }

    public ngAfterViewInit(): void {
        this.confirmModal.config.backdrop = true;
        this.confirmModal.config.ignoreBackdropClick = true;
    }

    public show(value?: any, message?: string): Promise<any> {
        this.value = value || this.value;
        this.message = message || this.message;
        this.dataObj = value;
        return new Promise<any>((resolve, reject) => {
            // resolution of the promise needs to be defferred until the user clicks a button
            this.buildDialogResponses(resolve, reject);
            this.confirmModal.show();
        });
    }

    public hide(): void {
        this.confirmModal.hide();
       
        
    }

    private buildDialogResponses(resolve, reject): any {
        this.sendConfirmResult = (): any => {
            this.confirmModal.hide();
            this.removeBackdrop();
            let objs = {
                modal:this.confirmModal,
                isCheckbox:this.isChecked
            }
            resolve(objs);
            return true;
        };
        this.sendCancelResult = (): any => {
            let objs = {
                modal:this.confirmModal,
                isCheckbox:this.isChecked,
                cancel:true
            }
            this.confirmModal.hide();
            this.removeBackdrop();
            reject(objs);
            return false;
        };
    }

    public onConfirmClick(event: Event): void {
        event.preventDefault();
        this.sendConfirmResult();
    }

    public onCancelClick(event: Event): void {
        event.preventDefault();
        this.sendCancelResult();
    }

    private removeBackdrop(){
        setTimeout(()=>{
            let ele = document.querySelector('bs-modal-backdrop');
            if(ele){
                let body = document.body.removeChild(ele);
            }
        },600)
        
    }
}
