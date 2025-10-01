import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl">Autenticación</h1>
      <div className="mt-4">
        <a href="/api/auth/signin">Iniciar sesión (email)</a>
      </div>
    </div>
  )
}
