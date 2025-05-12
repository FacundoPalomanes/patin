import { db } from "../firebase";
import { addDoc, collection, getDocs, getDoc, doc, query, orderBy } from "firebase/firestore";

export async function uploadNewPost(id: string, description: string, imageUrls: string[]) {
  try {
    const newPost = {
      userId: id,
      description,
      imageUrls,
      createdAt: new Date(),
    };

    // Agrega el documento con ID generado automáticamente
    await addDoc(collection(db, "posts"), newPost);

    return;
  } catch (error) {
    console.error("Error uploading the post: ", error);
    throw error;
  }
}


export async function getAllPostsOrdered() {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    // Definimos posts con userId como opcional
    const posts: { id: string; userId?: string }[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      
      // Si no existe 'userId', puedes manejarlo como desees, por ejemplo, dejarlo como undefined
      if (!data.userId) {
        console.error(`Post ${docSnap.id} is missing userId`);
        return { id: docSnap.id, userId: undefined }; // O hacer alguna otra gestión
      }

      return {
        id: docSnap.id,
        userId: data.userId,
        ...data, // Aquí se copian el resto de los datos del post
      };
    });

    const postsWithUser = await Promise.all(
      posts.map(async (post) => {
        try {
          if (!post.userId) {
            console.error(`Post ${post.id} has no userId. Skipping user fetch.`);
            return {
              post,
              user: null,
            };
          }

          const userRef = doc(db, "users", post.userId);
          const userSnap = await getDoc(userRef);

          const userData = userSnap.exists() ? userSnap.data() : null;

          return {
            post,
            user: userData,
          };
        } catch (err) {
          console.error(`Error fetching user ${post.userId}:`, err);
          return {
            post,
            user: null,
          };
        }
      })
    );

    return postsWithUser;
  } catch (error) {
    console.error("Error getting the posts: ", error);
    throw error;
  }
}
