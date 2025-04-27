"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

export default function WaitingVerify() {

  const [failed, setFailed] = useState<boolean>(false)

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    checkVerification(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkVerification(firstTime: boolean) {
    try {
      const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
        withCredentials: true,
      });

      const jwt = cookie.data.token;
      // Hacer la request con el JWT en el header Authorization
      const res = await axios(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/waitingVerify`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`, 
        },
        withCredentials: true, // Envia las cookies al backend
      });

      if (res.data.verified) {
        // REACT REDUX CREATION USER
        const user = res.data.user;
        dispatch(setUser({
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          fechaNacimiento: user.fechaNacimiento,
          categoria: user.categoria,
          dni: user.dni,
          photoURL: user.photoURL,
        }))
        router.push('/');
      }
      else if (firstTime === false) setFailed(true)
      return;
    } catch (error) {
      console.error("Error verificando:", error);
      router.push('/login');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-2xl font-bold mb-4 text-white">Esperando verificación</h1>
      <p className="text-gray-100 mb-6">Revisá tu email y verificá tu cuenta para continuar.</p>

      <button onClick={() => checkVerification(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow hover:cursor-pointer" >
        Ya verifiqué mi email
      </button>
      {failed === true && <p className="text-red-500 mt-4">Error al verificar el correo electrónico</p>}
    </div>
  );
}
