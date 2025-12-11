import { Component } from '@angular/core';
import { ConnectionService } from './_servizi/connection.service';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.scss'
})
export class AppComponent  {
    title = "Gotta Catch";
    connesso$: Observable<boolean>;
    isLoading$: Observable<boolean>;

    constructor(private connection: ConnectionService) {
        this.connesso$ = this.connection.online$;
        this.isLoading$ = this.connection.isLoading$;
    }
}
