import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { store } from "@/store";
import { setUser } from "@/store/slices/userSlice";
import axios from "axios";

export function useInitializeUserSession() {
  const router = useRouter();

  // This should be in every view, if the user is not there it make a fetch to get it and if you don't have a cookie or wifi or anything it pushes to login
  useEffect(() => {
    const initialize = async () => {
      const state = store.getState();
      const user = state.user;

      if (user && user.email) return; // Ya hay usuario, no hacemos nada

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/getUserWithCookie`, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        const data = response.data;
        if (data && data.user) {
          store.dispatch(setUser({
            name: data.user.name,
            surname: data.user.surname,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber,
            fechaNacimiento: data.user.fechaNacimiento,
            categoria: data.user.categoria,
            dni: data.user.dni,
            photoURL: data.user.photoURL,
            admin: data.user.admin
          }));
        } else {
          await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/logout`, {
            withCredentials: true
        })

        router.push('/login');
        }
      } catch (error) {
        console.error("No session found or error loading session:", error);
        router.push('/login');
      }
    };

    initialize();
  }, [router]);
}
