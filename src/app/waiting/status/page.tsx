'use client'
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'

export default function WaitingVerify() {

  const router = useRouter()
  useEffect(()=> {
    checkUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  async function checkUser() {
    try{
      const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
        withCredentials: true,
      });

      const jwt = cookie.data.token;

      console.log(jwt)

      // Hacer la request con el JWT en el header Authorization
      const res = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/waitingVerify`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true, // Envia las cookies al backend
      });

      console.log(res);

      if(res.data.status && res.data.verified) router.push('/');
    }catch(error) {
      console.error('Hubo un error :',error);
      // hacer algo
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-2xl font-bold mb-4 text-white">Esperando que aceptemos tu perfil</h1>
    </div>
  );
}