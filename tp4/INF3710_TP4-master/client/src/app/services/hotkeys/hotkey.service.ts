// Re-used from Log2990 project with the approval of all concerned parties

import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { EventManager } from "@angular/platform-browser";
import { Observable } from "rxjs";

interface Options {
    // tslint:disable-next-line: no-any | Reason : Creates an error with typedef HTMLElement
    element: any;
    description: string;
    keys: string;
}

@Injectable({
    providedIn: "root"
})

export class HotkeyService {

    public defaults: Partial<Options> = {
        element: this.document
    };

    public constructor(
        public eventManager: EventManager,
        @Inject(DOCUMENT) private document: Document) {
    }

    public addShortcut(options: Partial<Options>): Observable<Event> {
        const merged = { ...this.defaults, ...options };
        const event: string = `keydown.${merged.keys}`;

        return new Observable((observer) => {
            const handler = (e: Event) => {
                e.preventDefault();
                observer.next(e);
            };

            const dispose: Function = this.eventManager.addEventListener(
                merged.element, event, handler
            );

            return () => {
                dispose();
            };
        });
    }
}
