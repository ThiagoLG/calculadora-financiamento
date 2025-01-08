import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>404</h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>Página não encontrada</p>
      <Link href="/" style={{ fontSize: '18px', color: '#0070f3', textDecoration: 'underline' }}>
        Voltar para a página inicial
      </Link>
    </div>
  );
}
