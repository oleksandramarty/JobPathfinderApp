import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class BaseUnsubscribeComponent implements OnInit, OnDestroy {
    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
