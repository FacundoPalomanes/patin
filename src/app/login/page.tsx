'use client'

import Image from "next/image";
import patinIcon from '../../../public/patin_icon.png'
import AuthTabs from "../../../components/AuthTabs";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "./globals.css";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import Button from "../../../components/Button";

export default function Home() {

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>()
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [buttonStatusLogin, setButtonStatusLogin] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [buttonStatusRegister, setButtonStatusRegister] = useState<"idle" | "loading" | "success" | "error">("idle");


  const router = useRouter();

  const dispatch = useDispatch();

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setButtonStatusLogin("loading");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log(email, password);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      setButtonStatusLogin("error");
      return;
    }

    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setButtonStatusLogin("error");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });

      const data = response.data;
      setButtonStatusLogin("success");
      if (data.isVerified && data.status) {
        // REDUX USER CREATION
        dispatch(setUser({
          name: data.user.name,
          surname: data.user.surname,
          email: data.user.email,
          phoneNumber: data.user.phoneNumber,
          fechaNacimiento: data.user.fechaNacimiento,
          categoria: data.user.categoria,
          dni: data.user.dni,
          photoURL: data.user.photoURL,
          admin: data.user.admin,
        }))
        router.push('/')
      }
      else if (!data.isVerified) router.push('/waiting/verify');
      else if (!data.status) router.push('/waiting/status');

    } catch (error) {
      setButtonStatusLogin("error");
      console.error("Error al registrar:", error);
      setError('Hubo un problema al intentar iniciar sesion');
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setButtonStatusRegister("loading");

    const form = new FormData(e.currentTarget);
    const requiredFields = {
      name: form.get("name")?.toString().trim(),
      surname: form.get("surname")?.toString().trim(),
      email: form.get("email")?.toString().trim(),
      password: form.get("password")?.toString(),
      confirmPassword: form.get("confirmPassword")?.toString(),
      phoneNumber: form.get("phoneNumber")?.toString().trim(),
      dni: form.get("dni")?.toString().trim(),
      photo: form.get("uploadPhoto") as File,
    };

    const responsibleName = form.get("responsibleName")?.toString().trim();
    const responsiblePhone = form.get("responsiblePhone")?.toString().trim();

    // 🛑 Validaciones mínimas
    if (!requiredFields.name || requiredFields.name.length < 3) {
      setButtonStatusRegister('error');
      return setError("El nombre debe tener al menos 3 caracteres.");
    }

    if (!requiredFields.surname || requiredFields.surname.length < 3) {
      setButtonStatusRegister('error');
      return setError("El apellido debe tener al menos 3 caracteres.");

    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requiredFields.email || "")) {
      setButtonStatusRegister('error');
      return setError("Ingresa un correo electrónico válido.");
    }

    if (!requiredFields.password || requiredFields.password.length < 6) {
      setButtonStatusRegister('error');
      return setError("La contraseña debe tener al menos 6 caracteres.");

    }

    if (requiredFields.password !== requiredFields.confirmPassword) {
      setButtonStatusRegister('error');
      return setError("Las contraseñas no coinciden.");
    }

    if (!requiredFields.phoneNumber || requiredFields.phoneNumber.length < 8) {
      setButtonStatusRegister('error');
      return setError("Ingresa un número de teléfono válido.");

    }

    if (!birthDate) {
      setButtonStatusRegister('error');
      return setError("Debes seleccionar una fecha de nacimiento.");

    }

    if (!requiredFields.photo || requiredFields.photo.size === 0) {
      setButtonStatusRegister('error');
      return setError("Debes subir una foto.");
    }

    if (!/^\d{7,8}$/.test(requiredFields.dni || "")) {
      setButtonStatusRegister('error');
      return setError("Debes poner un DNI válido.");
    }

    if (calculateAge(birthDate) < 18) {
      if (!responsibleName || responsibleName.length < 3) {
      setButtonStatusRegister('error');
      return setError("Debes ingresar el nombre del adulto responsable.");
      }
      if (!responsiblePhone || responsiblePhone.length < 8) {
      setButtonStatusRegister('error');
      return setError("Debes ingresar un teléfono válido del adulto responsable.");
      }
    }


    const formattedBirthDate = birthDate.toISOString().split("T")[0];

    const newFormData = new FormData();
    newFormData.append("name", requiredFields.name!);
    newFormData.append("surname", requiredFields.surname!);
    newFormData.append("email", requiredFields.email!);
    newFormData.append("password", requiredFields.password!);
    newFormData.append("phoneNumber", requiredFields.phoneNumber!);
    newFormData.append("uploadPhoto", requiredFields.photo!);
    newFormData.append("fechaNacimiento", formattedBirthDate!);
    newFormData.append("dni", requiredFields.dni!);
    if (responsibleName) newFormData.append("responsibleName", responsibleName);
    if (responsiblePhone) newFormData.append("responsiblePhone", responsiblePhone);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_FETCH_URL}/auth/register`,
        newFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setButtonStatusRegister("success");

      router.push("/waiting/verify");
    } catch (error) {
      setButtonStatusRegister("error");
      console.error("Error al registrar:", error);
      setError("Hubo un error intentando registrarte");
    }
  }

  async function autoSignIn() {
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

      if (res.data.verified && res.data.status) {
        // REACT REDUX CREATION USER
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
          admin: user.admin
        }))
        router.push('/');
      }
      else if (!res.data.isVerified) router.push('/waiting/verify');
      else if (!res.data.status) router.push('/waiting/status');
      return;
    } catch (error) {
      console.log("No tiene ningun usuario ya registrado:", error);
    }
  }
  useEffect(() => {
    autoSignIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calculateAge = (date: Date) => {
    const today = new Date();
    const birth = new Date(date);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  }

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image className="mx-auto h-30 w-auto" src={patinIcon} width={500} height={500} alt="NacPatin Logo" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Iniciar Sesion en Nac Patin</h2>
        </div>

        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === 'login' ?
            (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
              >
                <form className="space-y-6" onSubmit={handleSignIn} action="#" method="POST">
                  <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium">Correo Electronico</label>
                    <div className="mt-2">
                      <input type="email" name="email" id="email" placeholder="" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm/6 font-medium">Contraseña</label>
                      <div className="text-sm">
                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Olvidaste la contraseña?</a>
                      </div>
                    </div>
                    <div className="mt-2">
                      <input type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                  </div>

                  <div>
                    <Button type="submit" initialText="Iniciar Sesion" externalStatus={buttonStatusLogin} />
                  </div>
                </form>
              </motion.div>
            ) :
            (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
              >
                <form className="space-y-6" onSubmit={handleRegister} action="#" method="POST">

                  <div>
                    <label htmlFor="name" className="block text-sm/6 font-medium">
                      Nombre y Apellido
                    </label>
                    <div className="mt-2 flex">
                      <input type="text" name="name" id="name" placeholder="Nombre" autoComplete="name" required className="dark:bg-gray-700 dark:border-gray-600 block w-47  rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                      <input type="text" name="surname" id="surname" placeholder="Apellido" autoComplete="surname" required className="dark:bg-gray-700 dark:border-gray-600 block ml-3 w-47 rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label htmlFor="email" className="block text-sm/6 font-medium">
                      Correo Electrónico
                    </label>
                    <div className="mt-2">
                      <input type="email" name="email" id="email" placeholder="" autoComplete="email" required className="dark:bg-gray-700 dark:border-gray-600 block w-full rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                  </div>


                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm/6 font-medium">
                      Numero de Telefono
                    </label>
                    <div className="mt-2">
                      <input type="number" name="phoneNumber" id="phoneNumber" autoComplete="cc-number" required className="dark:bg-gray-700 dark:border-gray-600 block w-full rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                  </div>


                  <div>
                    <label htmlFor="birthDate" className="block text-sm/6 font-medium text-white-900 dark:text-white">
                      Fecha de Nacimiento
                    </label>
                    <div className="mt-2">
                      <div className="relative w-full">
                        <DatePicker
                          selected={birthDate}
                          onChange={(date) => setBirthDate(date)}
                          showYearDropdown
                          showMonthDropdown
                          maxDate={new Date(new Date().getFullYear(), 11, 31)}
                          dropdownMode="select"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:outline-cyan-500"
                          placeholderText="Selecciona una fecha"
                          dateFormat="dd/MM/yyyy"
                          calendarClassName="custom-datepicker"
                        />
                      </div>
                    </div>
                  </div>

                  {birthDate !== null && calculateAge(birthDate) < 18 && (
                    <>
                      <div>
                        <label htmlFor="responsibleName" className="block text-sm/6 font-medium">
                          Nombre Adulto Responsable
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="responsibleName"
                            id="responsibleName"
                            placeholder="Nombre y Apellido"
                            required
                            className="dark:bg-gray-700 dark:border-gray-600 block w-full rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="responsiblePhone" className="block text-sm/6 font-medium">
                          Teléfono Adulto Responsable
                        </label>
                        <div className="mt-2">
                          <input
                            type="tel"
                            name="responsiblePhone"
                            id="responsiblePhone"
                            placeholder="Ej: 1123456789"
                            required
                            className="dark:bg-gray-700 dark:border-gray-600 block w-full rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                    </>
                  )}


                  <div>
                    <label htmlFor="dni" className="block text-sm/6 font-medium">
                      DNI
                    </label>
                    <div className="mt-2">
                      <input type="number" name="dni" id="dni" required autoComplete="off" className="dark:bg-gray-700 dark:border-gray-600 block w-full rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm/6 font-medium">
                      Contraseña
                    </label>
                    <div className="mt-2">
                      <input type="password" name="password" id="password" autoComplete="new-password" required className="dark:bg-gray-700 dark:border-gray-600 block w-full rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm/6 font-medium">
                      Confirmar Contraseña
                    </label>
                    <div className="mt-2">
                      <input type="password" name="confirmPassword" id="confirmPassword" autoComplete="new-password" required className="dark:bg-gray-700 dark:border-gray-600 block w-full rounded-md bg-white px-3 py-1.5 text-base text-white-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="uploadPhoto" className="block text-sm/6 font-medium">
                      Subir Foto de Perfil
                    </label>
                    <div className="mt-2">
                      <label htmlFor="uploadPhoto" className="mb-5 w-full h-11 rounded-3xl dark:bg-gray-700 dark:border-gray-600 justify-between items-center inline-flex cursor-pointer">
                        <h2 className="text-gray-500 text-sm font-normal leading-snug pl-4">{selectedImage ? selectedImage.name : "Ningun archivo elegido"}</h2>
                        <div className="flex w-28 h-11 px-2 flex-col bg-indigo-600 rounded-r-3xl shadow text-white text-xs font-semibold leading-4 items-center justify-center">
                          Elegir Archivo
                        </div>
                      </label>
                      <input id="uploadPhoto" name="uploadPhoto" type="file" className="hidden" required onChange={handleImageChange} />
                    </div>
                  </div>



                  <div>
                    <Button initialText="Registrarse" type="submit" externalStatus={buttonStatusRegister} />
                  </div>
                </form>
              </motion.div>
            )
          }
        </AnimatePresence>

        {error != null && <p className="text-red-500 mt-4 text-lg text-center">{error}</p>}

      </div>
    </div>
  );
}
