import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userIdSubject = new BehaviorSubject<string | null>(null);

    /** Observable stream of the current logged-in userId. */
    readonly userId$ = this.userIdSubject.asObservable();

    /** Current value of the logged-in userId (or null). */
    get userId(): string | null {
        return this.userIdSubject.value;
    }

    /** Set or clear the current userId. */
    setUserId(userId: string | null): void {
        this.userIdSubject.next(userId);
    }

    /** Convenience helper to check if a user is logged in. */
    get isLoggedIn(): boolean {
        return !!this.userId;
    }
}
