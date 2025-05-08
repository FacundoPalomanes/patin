"use client";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import { useInitializeUserSession } from "../../../functions/initializeUserSession";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Button from "../../../components/Button";

export default function Settings() {
    useInitializeUserSession();
    const user = useSelector((state: RootState) => state.user);
    const [selectedSection, setSelectedSection] = useState("profile");
    const [errorsProfile, setErrorsProfile] = useState<string>()
    const [errorsPassword, setErrorsPassword] = useState<string>()
    // const [errorsEmail, setErrorsEmail] = useState<string>()

    const [buttonStatusProfile, setButtonStatusProfile] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [buttonStatusPassword, setButtonStatusPassword] = useState<"idle" | "loading" | "success" | "error">("idle");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setButtonStatusProfile("idle");
        setButtonStatusPassword("idle");
        setErrorsProfile("");
        setErrorsPassword("");
    }, [selectedSection]);


    const [photoPreview, setPhotoPreview] = useState(user?.photoURL);
    useEffect(() => {
        if (user?.photoURL) setPhotoPreview(user.photoURL);
    }, [user?.photoURL])
    if (!user) return <div className="text-white p-4">Cargando usuario...</div>;

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonStatusProfile("loading");
        const formData = new FormData(e.currentTarget);

        const nombre = formData.get("nombre")?.toString().trim() || "";
        const apellido = formData.get("apellido")?.toString().trim() || "";
        const categoria = formData.get("categoria")?.toString() || "";
        const dni = formData.get("dni")?.toString().trim() || "";
        const telefono = formData.get("telefono")?.toString().trim() || "";
        const fotoFile = formData.get("foto") as File; // campo de <input type="file" name="foto" />

        // Comparar con los datos actuales
        const formToSend = new FormData();

        if (nombre && nombre !== user.name) formToSend.append("nombre", nombre);
        if (apellido && apellido !== user.surname) formToSend.append("apellido", apellido);
        if (categoria !== user.categoria) formToSend.append("categoria", categoria);
        if (dni && dni !== user.dni) formToSend.append("dni", dni);
        if (telefono && telefono !== user.phoneNumber) formToSend.append("telefono", telefono);

        if (fotoFile && fotoFile.size > 0) {
            formToSend.append("foto", fotoFile);
        }

        // Si no hay nada que enviar
        if (Array.from(formToSend.entries()).length === 0) {
            console.log("No hay cambios para enviar");
            setErrorsProfile("No hay ningun cambio");
            setButtonStatusProfile("error");
            return;
        }

        // Validaciones sobre los campos que están en el formToSend
        const errores: string[] = [];

        if (formToSend.has("nombre") && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s'-]{2,40}$/.test(nombre)) {
            errores.push("Nombre inválido");
        }

        if (formToSend.has("apellido") && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s'-]{2,40}$/.test(apellido)) {
            errores.push("Apellido inválido");
        }

        if (formToSend.has("dni") && !/^\d{7,10}$/.test(dni)) {
            errores.push("DNI inválido");
        }

        if (formToSend.has("telefono") && !/^\+?\d{7,15}$/.test(telefono)) {
            errores.push("Teléfono inválido");
        }

        if (errores.length > 0) {
            setButtonStatusProfile("error");
            setErrorsProfile("Errores en el formulario:\n" + errores.join("\n"));
            return;
        }

        try {
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_FETCH_URL}/user/editUser`,
                formToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${jwt}`
                    },
                    withCredentials: true,
                }
            );
            setButtonStatusProfile("success");

            console.log("Respuesta del servidor:", response.data);
            // Mostrar feedback o refrescar datos si todo salió bien
        } catch (err) {
            console.error("Error al enviar los datos:", err);
            setErrorsProfile("Error al actualizar el perfil.");
            setButtonStatusProfile("error");
        }
    };

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonStatusPassword("loading");
        const formData = new FormData(e.currentTarget);

        const actualPassword = formData.get("actualPassword")?.toString().trim() || "";
        const newPassword = formData.get("newPassword")?.toString().trim() || "";

        if (!actualPassword || !newPassword) {
            setErrorsPassword("Por favor completá ambos campos.");
            setButtonStatusPassword("error");
            return;
        }

        // Validaciones
        const errores: string[] = [];

        if (newPassword.length < 6) {
            errores.push("La nueva contraseña debe tener al menos 6 caracteres.");
        }

        if (errores.length > 0) {
            setErrorsPassword("Errores en el formulario:\n" + errores.join("\n"));
            setButtonStatusPassword("error");
            return;
        }

        try {
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_FETCH_URL}/user/changePassword`, { actualPassword, newPassword, email: user.email },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                    withCredentials: true,
                },
            );

            console.log("Contraseña cambiada correctamente:", response.data);
            setButtonStatusPassword("success");
            setErrorsPassword(""); // limpiar errores si todo sale bien
            // Podés mostrar un mensaje de éxito si querés
        } catch (err) {
            console.error("Error al cambiar la contraseña:", err);
            setErrorsPassword("Error al cambiar la contraseña.");
            setButtonStatusPassword("error");
        }
    };

    // const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const formData = new FormData(e.currentTarget);

    //     const newEmail = formData.get("nuevoCorreo")?.toString().trim() || "";
    //     const password = formData.get("password")?.toString().trim() || "";

    //     if (!password || !newEmail) {
    //         setErrorsEmail("Por favor completá ambos campos.");
    //         return;
    //     }

    //     // Validaciones básicas
    //     const errores: string[] = [];
    //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    //         errores.push("El nuevo correo debe ser válido.");
    //     }

    //     if (errores.length > 0) {
    //         setErrorsEmail("Errores en el formulario:\n" + errores.join("\n"));
    //         return;
    //     }

    //     try {
    //         const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
    //             withCredentials: true,
    //         });

    //         const jwt = cookie.data.token;

    //         const response = await axios.post(
    //             `${process.env.NEXT_PUBLIC_FETCH_URL}/user/requestEmailChange`,
    //             { newEmail, password, email: user.email },
    //             {
    //                 headers: { Authorization: `Bearer ${jwt}` },
    //                 withCredentials: true,
    //             }
    //         );
    //         console.log("Correo de verificación enviado:", response.data);
    //         setErrorsEmail("");

    //     } catch (err) {
    //         console.error("Error al procesar solicitud:", err);
    //         setErrorsEmail("Ocurrió un error al procesar el formulario.");
    //     }
    // };





    const renderContent = () => {
        const inputStyle = "block w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded-md text-white";

        switch (selectedSection) {
            case "password":
                return (
                    <motion.form
                        onSubmit={handlePasswordChange}
                        key="password"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800 p-8 rounded-lg shadow"
                    >
                        <h2 className="text-white text-xl font-semibold mb-4">Cambiar Contraseña</h2>

                        <label className="text-sm text-white">Contraseña actual</label>
                        <input
                            type="password"
                            name="actualPassword"
                            placeholder="Contraseña actual"
                            className={inputStyle}
                        />

                        <label className="text-sm text-white mt-4 block">Nueva contraseña</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Nueva contraseña"
                            className={`${inputStyle} mt-1`}
                        />

                        <div className="mt-5">
                            <Button initialText="Guardar Contraseña" type="submit" externalStatus={buttonStatusPassword} />
                        </div>

                        {errorsPassword ? (
                            <p className="mt-4 text-red-500 whitespace-pre-line text-sm text-center">{errorsPassword}</p>
                        ) : null}
                    </motion.form>
                );
            // case "email":
            //     return (
            //         <motion.div initial={{ opacity: 0, y: 20 }}
            //             animate={{ opacity: 1, y: 0 }}
            //             exit={{ opacity: 0, y: -20 }}
            //             transition={{ duration: 0.3 }} className="bg-slate-800 p-8 rounded-lg shadow mb-10">
            //             <form onSubmit={handleEmailSubmit} key="email"  >
            //                 <h2 className="text-white text-xl font-semibold mb-4">Cambiar Correo Electronico</h2>
            //                 <p>Estar seguro de apretar el boton de Cambiar correo, una vez presionado se enviara al email puesto un link para verificar el cambio, mientras q en los datos ya aparecera el nuevo email</p>

            //                 <h1 className="text-center text-[1.5rem] mt-5">Verificacion</h1>
            //                 <label className="text-sm text-white">Correo Nuevo</label>
            //                 <input
            //                     type="email"
            //                     name="nuevoCorreo"
            //                     placeholder="Correo Nuevo"
            //                     className={inputStyle}
            //                 />

            //                 <label className="text-sm text-white mt-4 block">Contraseña</label>
            //                 <input
            //                     type="password"
            //                     name="password"
            //                     placeholder="Contraseña"
            //                     className={`${inputStyle} mt-1`}
            //                 />

            //                 <button type="submit" className="w-full mt-6 bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-md hover:cursor-pointer">
            //                     Cambiar Correo
            //                 </button>

            //                 {errorsEmail ? (
            //                     <p className="mt-4 text-red-500 whitespace-pre-line text-sm text-center">{errorsEmail}</p>
            //                 ) : null}
            //             </form>
            //         </motion.div>

            //     );
            default:
                return (
                    <motion.form
                        onSubmit={handleSubmit}
                        key="profile"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800 p-8 rounded-lg shadow mb-10"
                    >
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-32 h-32">
                                {photoPreview ? (
                                    <Image
                                        src={
                                            photoPreview?.startsWith("http")
                                                ? `${photoPreview}?cacheBust=${Date.now()}`
                                                : photoPreview || ""
                                        }
                                        alt="Foto de perfil"
                                        fill
                                        className="rounded-full object-cover hover:cursor-pointer"
                                        onClick={handleImageClick}
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full rounded-full bg-slate-600 flex items-center justify-center text-white cursor-pointer"
                                        onClick={handleImageClick}
                                    >
                                        Sin imagen
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    id="foto"
                                    name="foto"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                            <div>
                                <label className="text-sm">Nombre</label>
                                <input type="text" className={inputStyle} defaultValue={user.name} name="nombre" />
                            </div>
                            <div>
                                <label className="text-sm">Apellido</label>
                                <input type="text" className={inputStyle} defaultValue={user.surname} name="apellido" />
                            </div>
                            <div>
                                <label className="text-sm">Categoría</label>
                                <select className={inputStyle} defaultValue={user.categoria ?? ''} name="categoria">
                                    <option value="">Ninguna Categoria</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="Promo">Promo</option>
                                    <option value="Inicial">Inicial</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm">DNI</label>
                                <input type="text" className={inputStyle} placeholder={user.dni} name="dni" />
                            </div>
                            <div>
                                <label className="text-sm">Teléfono</label>
                                <input type="text" className={inputStyle} placeholder={user.phoneNumber} name="telefono" />
                            </div>
                            <div>
                                <label className="text-sm">Fecha de nacimiento</label>
                                <input type="date" className={inputStyle} defaultValue={user.fechaNacimiento} name="fechaNacimiento" readOnly />
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button initialText="Guardar Cambios" type="submit" externalStatus={buttonStatusProfile} />
                        </div>
                        {errorsProfile ? <h1 className="mt-5 text-center text-red-700">{errorsProfile}</h1> : null}
                    </motion.form>
                );
        }
    };

    return (
        <div>
            <Navbar user={user} />
            <div className="w-10/12 mx-auto max-w-6xl grid grid-cols-6 gap-8 mt-10">
                <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
                    <button
                        onClick={() => setSelectedSection("profile")}
                        className={`p-4 text-left rounded-lg transition-colors hover:cursor-pointer ${selectedSection === "profile"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-white"
                            }`}
                    >
                        Editar Perfil
                    </button>
                    <button
                        onClick={() => setSelectedSection("password")}
                        className={`p-4 text-left rounded-lg transition-colors hover:cursor-pointer ${selectedSection === "password"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-white"
                            }`}
                    >
                        Cambiar Contraseña
                    </button>
                    {/* <button
                        onClick={() => setSelectedSection("email")}
                        className={`p-4 text-left rounded-lg transition-colors hover:cursor-pointer ${selectedSection === "email"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-white"
                            }`}
                    >
                        Cambiar Correo
                    </button> */}
                </div>

                <div className="col-span-6 md:col-span-4">{renderContent()}</div>
            </div>
        </div>
    );
}
