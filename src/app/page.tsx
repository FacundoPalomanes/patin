'use client'
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useInitializeUserSession } from '../../functions/initializeUserSession';
import Navbar from '../../components/Navbar';
import Posts from '../../components/Posts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  useInitializeUserSession();

  const user = useSelector((state: RootState) => state.user);
  const [error, setError] = useState<null | string>(null);
  const [posts, setPosts] = useState([]); // guardar los posts aquí

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    try {
      const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
        withCredentials: true,
      });

      const jwt = cookie.data.token;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/posts/getPosts`, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      });

      setPosts(res.data); // aquí guardas los posts recibidos
    } catch (error) {
      console.log('There was an error trying to get the posts', error);
      setError("Hubo un error al intentar traer los posts, recargue la página");
    }
  }

  if (!user) return;

  return (
    <div>
      <Navbar user={user} />
      <h1 className='text-center text-3xl mt-5'>Bienvenido {user.name}</h1>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <div className="flex flex-col items-center gap-4 mt-6">
          {posts.map(({ post, user }, index) => (
            <Posts key={index} post={post} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
