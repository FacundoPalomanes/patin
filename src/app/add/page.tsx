'use client'

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useInitializeUserSession } from '../../../functions/initializeUserSession';
import Navbar from '../../../components/Navbar';
import axios from 'axios';
import Image from 'next/image';
import Select from '../../../components/Select';
import { UserNotification } from '../../../interface/AddInterfaces';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';

export default function Add() {
    useInitializeUserSession();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);

    const [selectedSection, setSelectedSection] = useState("add");
    const [images, setImages] = useState<File[]>([]);
    const [category, setCategory] = useState('');

    const [users, setUsers] = useState<UserNotification[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserNotification | null>(null);

    const [descriptionPost, setDescriptionPost] = useState('');
    const [errorPost, setErrorPost] = useState<string | null>(null);

    const [usersAccepting, setUsersAccepting] = useState<UserNotification[]>([]);
    const [selectedUsersAccepting, setSelectedUsersAccepting] = useState<UserNotification | null>(null);
    const [errorUserAccepting, setErrorUserAccepting] = useState<string | null>(null);

    const [descriptionNotification, setDescriptionNotification] = useState('');
    const [errorNotification, setErrorNotification] = useState<string | null>(null);

    const [usersToSetAdmin, setUsersToSetAdmin] = useState<UserNotification[]>([])
    const [selectedUsersAdmin, setSelectedUsersAdmin] = useState<UserNotification | null>(null);
    const [errorSetAdmin, setErrorSetAdmin] = useState<string | null>(null);




    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmitPosts = async () => {
        if (!descriptionPost.trim()) {
            setErrorPost('Debes escribir una descripción.');
            return false;
        }

        const formData = new FormData();
        formData.append('description', descriptionPost);

        images.forEach((img) => {
            formData.append('images', img);
        });

        try {
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            await axios.post(`${process.env.NEXT_PUBLIC_FETCH_URL}/posts/newPost`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${jwt}`,
                },
                withCredentials: true,
            });

            setDescriptionPost('');
            setImages([]);
            setErrorPost("");
            return true;
        } catch (error) {
            console.error('Error al enviar el post:', error);
            setErrorPost('Ocurrió un error inesperado');
            return false;
        }
    };

    const handleSubmitNotifications = async () => {
        if (!descriptionNotification.trim()) {
            setErrorNotification('Debes escribir una descripción.');
            return false;
        }

        const formData = new FormData();
        formData.append('description', descriptionNotification);

        if (selectedUser) {
            formData.append('receiverId', selectedUser.id); // o "all" si el id es 0
        }

        try {
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            await axios.post(`${process.env.NEXT_PUBLIC_FETCH_URL}/notifications/addNotification`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${jwt}`,
                },
                withCredentials: true,
            });

            setDescriptionNotification('');
            setErrorNotification("");
            return true;
        } catch (error) {
            console.error('Error al enviar la notificación:', error);
            setErrorNotification('Ocurrió un error inesperado');
            return false;
        }
    };

    const handleSubmitPosibleUser = async () => {
        try {
            if (selectedUsersAccepting === null) {
                setErrorUserAccepting("No ingreso ningun usuario");
                return false;
            }

            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            // Construir el body dinámicamente
            const body = {
                userId: selectedUsersAccepting.id,
                ...(category && { category }), // solo se agrega si category tiene un valor no vacío
            };

            await axios.post(
                `${process.env.NEXT_PUBLIC_FETCH_URL}/admin/acceptUser`,
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                    withCredentials: true,
                }
            );

            // Eliminar el usuario aceptado de la lista
            setUsersAccepting((prev) => {
                const updated = prev.filter(user => user.id !== selectedUsersAccepting.id);
                if (updated.length > 0) {
                    setSelectedUsersAccepting(updated[0]);
                } else {
                    setSelectedUsersAccepting(null);
                }
                return updated;
            });

            setErrorUserAccepting("");
            return true;
        } catch (error) {
            console.error('Error intentando aceptar el usuario:', error);
            setErrorUserAccepting('Ocurrió un error inesperado');
            return false
        }
    };


    const handleSubmitNewAdmin = async () => {
        try {
            if (selectedUsersAdmin === null) {
                setErrorSetAdmin("No ingreso ningun usuario");
                return false; 
            }
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            await axios.post(
                `${process.env.NEXT_PUBLIC_FETCH_URL}/admin/newAdmin`,
                { userId: selectedUsersAdmin.id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                    withCredentials: true,
                }
            );
            setUsersToSetAdmin((prev) => {
                const updated = prev.filter(user => user.id !== selectedUsersAdmin.id);
                // Actualizar el usuario seleccionado si era el mismo que se eliminó
                if (updated.length > 0) {
                    setSelectedUsersAdmin(updated[0]);
                } else {
                    setSelectedUsersAdmin(null);
                }
                return updated;
            });

            setErrorSetAdmin("");
            return true;
        } catch (error) {
            console.error('Hubo un error añadiendo el admin: ', error);
            setErrorSetAdmin("Hubo un error añadiendo el admin, por favor reinicia la pagina");
            return false;
        }
    }

    const getUsers = async () => {
        try {
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            const res = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/notifications/getUsers`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${jwt}`,
                },
                withCredentials: true,
            });

            const fetchedUsers = [...res.data]; // Clonamos el array

            // Agregamos el usuario especial al principio si aún no está
            if (fetchedUsers.length === 0 || fetchedUsers[0]?.id !== "0") {
                fetchedUsers.unshift({
                    id: "0",
                    name: "Agregar",
                    surname: "a todos los usuarios",
                    photoUrl: "https://www.svgrepo.com/show/98597/global.svg"
                });
            }

            setUsers(fetchedUsers);

            // También podrías setear selectedUser acá si querés eliminar el useEffect
            if (!selectedUser) {
                setSelectedUser(fetchedUsers[0]);
            }

        } catch (error) {
            console.error("Hubo un error trayendo los usuarios: ", error);
            setErrorNotification("Hubo un error con los usuarios, por favor recargue la pagina");
        }
    };

    const getPosibleUsers = async () => {
        try {
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            const res = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/admin/getPosibleUsers`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${jwt}`,
                },
                withCredentials: true,
            });

            setUsersAccepting(res.data);

            // // También podrías setear selectedUser acá si querés eliminar el useEffect
            if (!selectedUsersAccepting) {
                setSelectedUsersAccepting(res.data[0]);
            }

        } catch (error) {
            console.error("Hubo un error trayendo los usuarios: ", error);
            setErrorUserAccepting("Hubo un error con los usuarios, por favor recargue la pagina");
        }
    }

    const getUsersToAdmin = async () => {
        try {
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;

            const res = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/admin/getUsersPossibleAdmins`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${jwt}`,
                },
                withCredentials: true,
            });


            console.log(res.data)
            setUsersToSetAdmin(res.data);

            // // También podrías setear selectedUser acá si querés eliminar el useEffect
            if (!selectedUsersAdmin) {
                setSelectedUsersAdmin(res.data[0]);
            }
        } catch (error) {
            console.error('Hubo un error trayendo los usuarios: ', error);
            setErrorSetAdmin("Hubo un error con los usuarios, por favor recargue la pagina");
        }
    }

    const renderContent = () => {
        switch (selectedSection) {
            case "add":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800 p-8 rounded-lg shadow"
                    >
                        <div className="p-4 max-w-xl mx-auto">

                            <h1 className="text-xl font-bold my-4">Crear nuevo post</h1>

                            <textarea
                                className="w-full border p-2 rounded mb-4"
                                placeholder="Escribe una descripción..."
                                value={descriptionPost}
                                onChange={(e) => setDescriptionPost(e.target.value)}
                            />

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mb-4"
                            />

                            <div className="flex flex-wrap gap-2 mb-4">
                                {images.map((img, i) => (
                                    <Image
                                        key={i}
                                        src={URL.createObjectURL(img)}
                                        alt="preview"
                                        className="w-24 h-24 object-cover rounded"
                                        height={500} width={500}
                                    />
                                ))}
                            </div>


                            <Button initialText='Publicar' type='button' onClick={handleSubmitPosts} />
                            {errorPost ? <h1 className='text-center mt-4 text-red-500 text-lg'>{errorPost}</h1> : null}
                        </div>

                        <div className="p-4 max-w-xl mx-auto">

                            <h1 className="text-xl font-bold my-4">Crear Notificacion</h1>

                            <textarea
                                className="w-full border p-2 rounded mb-4"
                                placeholder="Escribe una descripción..."
                                value={descriptionNotification}
                                onChange={(e) => setDescriptionNotification(e.target.value)}
                            />

                            <Select users={users} selectedUser={selectedUser} onChangeSelectedUser={setSelectedUser} />

                            <Button initialText='Publicar' type='button' onClick={handleSubmitNotifications} />
                            {errorNotification ? <h1 className='text-center mt-4 text-red-500 text-lg'>{errorNotification}</h1> : null}
                        </div>
                    </motion.div>
                );
            case "users":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800 p-8 rounded-lg shadow"
                    >
                        <div className="p-4 max-w-xl mx-auto">

                            <h1 className="text-xl font-bold my-4">Aceptar Usuario</h1>

                            {usersAccepting.length > 0 ? <div>
                                <Select users={usersAccepting} selectedUser={selectedUsersAccepting} onChangeSelectedUser={setSelectedUsersAccepting} />
                                <div>
                                    <label htmlFor="category" className="block text-sm/6 font-medium ">
                                        Elegir Categoria
                                    </label>
                                    <div className="mb-5 mt-3">
                                        <select
                                            id="category"
                                            name="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                            className="dark:bg-gray-700 dark:border-gray-600 border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                            <option value="">Ninguna</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="Promo">Promo</option>
                                            <option value="Inicial">Inicial</option>
                                        </select>
                                    </div>
                                    <Button initialText='Aceptar Usuario' type='button' onClick={handleSubmitPosibleUser} />
                                </div>
                            </div> : <h1 className='text-center m-4'>No hay mas usuarios para aceptar</h1>}




                            {errorUserAccepting ? <h1 className='text-center mt-4 text-red-500 text-lg'>{errorUserAccepting}</h1> : null}
                        </div>
                        <div className="p-4 max-w-xl mx-auto">

                            <h1 className="text-xl font-bold my-4">Hacer Administrador</h1>

                            {usersToSetAdmin.length > 0 ?
                                <div>
                                    <Select users={usersToSetAdmin} selectedUser={selectedUsersAdmin} onChangeSelectedUser={setSelectedUsersAdmin} />
                                    <Button initialText='Hacer Administrador' type='button' onClick={handleSubmitNewAdmin}/>
                                </div>
                                : <h1 className='text-center m-4'>No hay mas usuarios para hacer admin</h1>}

                            {errorSetAdmin ? <h1 className='text-center mt-4 text-red-500 text-lg'>{errorSetAdmin}</h1> : null}
                        </div>
                    </motion.div>
                )


        };
    }


    useEffect(() => {
        getUsers();
        getPosibleUsers();
        getUsersToAdmin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setErrorNotification("")
        setErrorPost("");
        setErrorUserAccepting("");
        setErrorSetAdmin("");
    }, [selectedSection])


    if (!user) return null;
    if (!user.admin) return router.push('/');

    return (
        <div>
            <Navbar user={user} />

            <div className="w-10/12 mx-auto max-w-6xl grid grid-cols-6 gap-8 mt-10">
                <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
                    <button
                        onClick={() => setSelectedSection("add")}
                        className={`p-4 text-left rounded-lg transition-colors hover:cursor-pointer ${selectedSection === "add"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-white"
                            }`}
                    >
                        Añadir Post / Notificacion
                    </button>
                    <button
                        onClick={() => setSelectedSection("users")}
                        className={`p-4 text-left rounded-lg transition-colors hover:cursor-pointer ${selectedSection === "users"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-white"
                            }`}
                    >
                        Aceptar Usuarios
                    </button>
                </div>

                <div className="col-span-6 md:col-span-4">{renderContent()}</div>
            </div>
        </div>
    );
}
