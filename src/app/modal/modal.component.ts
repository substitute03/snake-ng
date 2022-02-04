import { Component, Input } from '@angular/core';

@Component({
    selector: 'sng-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
    @Input() title: string = '';
    @Input() body: string = '';

    public isShowModal: boolean = false;

    public show(): void{
        this.isShowModal = true;
    }

    public hide(): void{
        this.isShowModal = false;
    }
}
