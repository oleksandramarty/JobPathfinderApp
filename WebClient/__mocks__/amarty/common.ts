export class BaseUnsubscribeComponent {
    protected ngUnsubscribe = {
        next: () => {},
        complete: () => {}
    };

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
