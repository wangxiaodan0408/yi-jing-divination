'use client';

import { useEffect, useState } from 'react';

function generateUserId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${random}`;
}

const USER_ID_KEY = 'divinationUserId';

export function useUserId() {
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let storedUserId = localStorage.getItem(USER_ID_KEY);
    
    if (!storedUserId) {
      storedUserId = generateUserId();
      localStorage.setItem(USER_ID_KEY, storedUserId);
    }
    
    setUserId(storedUserId);
    setIsLoading(false);
  }, []);

  return { userId, isLoading };
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const adminParam = searchParams.get('admin');
    const ADMIN_SECRET = 'secret123';
    setIsAdmin(adminParam === ADMIN_SECRET);
  }, []);

  return isAdmin;
}
