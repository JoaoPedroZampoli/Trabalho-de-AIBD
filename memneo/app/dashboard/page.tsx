import { Suspense } from 'react';
import DashboardClient from './pageClient';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
