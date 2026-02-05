import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./pages/submit-notes/submit-notes.component').then(m => m.SubmitNotesComponent);
        }
    },
    {
        path: 'register',
        loadComponent: () => {
            return import('./pages/register/register.component').then(m => m.RegisterComponent);
        }
    },
    {
        path: 'login',
        loadComponent: () => {
            return import('./pages/login/login.component').then(m => m.LoginComponent);
        }
    },
    {
        path: 'submit-notes',
        loadComponent: () => {
            return import('./pages/submit-notes/submit-notes.component').then(m => m.SubmitNotesComponent);
        }
    },
    {
        path: 'clinical-history',
        loadComponent: () => {
            return import('./pages/clinical-history/clinical-history.component').then(m => m.ClinicalHistoryComponent);
        }
    },
    {
        path: 'clinical-details',
        loadComponent: () => {
            return import('./pages/clinical-details/clinical-details.component').then(m => m.ClinicalDetailsComponent);
        }
    },
];
