"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import Button from "../../../../components/Button";

export default function WaitingVerify() {

  const [failed, setFailed] = useState<boolean>(false)

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    checkVerification(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkVerification(firstTime: boolean): Promise<boolean> {
    try {
      const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
        withCredentials: true,
      });
  
      const jwt = cookie.data.token;
  
      const res = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/waitingVerify`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
  
      if (res.data.verified && res.data.status) {
        const user = res.data.user;
        dispatch(setUser({
          name: user.name,
          surname: user.surname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          fechaNacimiento: user.fechaNacimiento,
          categoria: user.categoria,
          dni: user.dni,
          photoURL: user.photoURL,
          admin: user.admin,
        }))
        router.push('/');
        return true;
      } else if (res.data.verified && !res.data.status) {
        router.push('/waiting/status');
        return true;
      }
  
      if (!res.data.verified && !firstTime) {
        setFailed(true);
        return false;
      }
  
      return false; // <- Agregado para evitar devolver `undefined`
    } catch (error) {
      console.error("Error verificando:", error);
      router.push('/login');
      return false;
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-2xl font-bold mb-4 text-white">Esperando verificación</h1>
      <p className="text-gray-100 mb-6">Revisá tu email y verificá tu cuenta para continuar.</p>
      <div className="mt-2">
        <Button onClick={() => checkVerification(false)} initialText="Ya verifique mi Mail" type="button" />
      </div>
      {failed === true && <p className="text-red-500 mt-4">Error al verificar el correo electrónico</p>}
    </div>
  );
}
