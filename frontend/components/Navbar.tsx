'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import { Briefcase, LogOut, User, Building2 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">JobConnect</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/jobs"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/jobs'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Vagas
              </Link>
              
              {isAuthenticated && user?.type === 'company' && (
                <Link
                  href="/company/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith('/company')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard Empresa
                </Link>
              )}
              
              {isAuthenticated && user?.type === 'user' && (
                <Link
                  href="/candidate/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith('/candidate')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Meu Painel
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/register/candidate">
                  <Button>Cadastrar</Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  {user?.type === 'user' ? (
                    <User className="h-5 w-5 text-gray-600" />
                  ) : user?.type === 'company' ? (
                    <Building2 className="h-5 w-5 text-gray-600" />
                  ) : null}
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

