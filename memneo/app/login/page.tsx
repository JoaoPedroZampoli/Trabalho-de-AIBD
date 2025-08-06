import { Suspense } from 'react';
import LoginClient from './pageClient';

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <LoginClient />
        </Suspense>
    );
}
