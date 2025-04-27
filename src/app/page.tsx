'use client'

import { useSelector } from 'react-redux';
import { RootState } from '@/store';


export default function Home() {
  
  const user = useSelector((state: RootState) => state.user);

  console.log(user)
  
  return (
    <div>
      <h1>bienvenido a la app {user === null ? 'no hay usuario' : user.name}</h1>
    </div>
  );
}