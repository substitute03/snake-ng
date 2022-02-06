import { Component, Input } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
    selector: 'sng-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
    @Input() title: string = '';
    @Input() body: string = '';

    public isShowModal: boolean = false;

    get modal(){
        return new bootstrap.Modal(document.getElementById("modal")!, {});
    }

    public show(): void{
        this.modal.show();
    }

    public hide(): void{
        this.modal.hide();
    }
}