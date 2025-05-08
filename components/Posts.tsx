"use client"
import { useState } from "react";
import { PostsInterface } from "../interface/AddInterfaces";
import { UserState } from "../interface/UserState";
import Image from "next/image";



interface PostProps {
  post: PostsInterface;
  user: UserState;
}


export default function Posts({ post, user }: PostProps) {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (src: string) => {
    setSelectedImage(src);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const createdAt = new Date(post.createdAt.seconds * 1000);



  return (
    <main className="h-full w-full flex items-center justify-center">
      <div className="border max-w-screen-md mt-6 rounded-2xl p-4 ms:m-0 ">
        <div className="flex items-center	justify-between">
          <div className="gap-3.5	flex items-center ">
            <Image src={`${user.photoURL}?cacheBust=${Date.now()}`} className="object-cover bg-yellow-500 rounded-full w-10 h-10" width={500} height={500} alt="User Profile" />
            <div className="flex flex-col">
              {/* Here goes the name */}
              <b className="mb-2 capitalize">{user.name} {user.surname}</b>
              {/* Here goes the date of it */}
              <time dateTime={createdAt.toISOString()} className="text-gray-400 text-xs">
                {createdAt.toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          </div>


          <div className="rounded-full h-3.5 flex	items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="34px" fill="#fff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
        </div>
        <div className="whitespace-pre-wrap mt-7">{post.description}</div>
        {/* HERE IS THE IMAGE CONTAINER */}
        <div className="mt-5 flex gap-2	 justify-center  pb-4 flex-wrap	">
          {post.imageUrls
            ? post.imageUrls.map((url, index) => {
              return (
                <Image
                  key={index}
                  alt="photos"
                  src={`${url}`}
                  width={500}
                  height={500}
                  className="bg-red-500 rounded-2xl w-1/3 object-cover h-96 flex-auto cursor-pointer"
                  onClick={() => openImage(url)}
                />
              );
            })
            : null}
        </div>
        {/* <div className=" h-16 border-b  flex items-center justify-around	">
            <div className="flex items-center	gap-3	">
              <svg width="20px" height="19px" viewBox="0 0 20 19" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="?-Social-Media" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Square_Timeline" transform="translate(-312.000000, -746.000000)">
                    <g id="Post-1" transform="translate(280.000000, 227.000000)">
                      <g id="Post-Action" transform="translate(0.000000, 495.000000)">
                        <g transform="translate(30.000000, 21.000000)" id="Comment">
                          <g>
                            <g id="ic_comment-Component/icon/ic_comment">
                              <g id="Comments">
                                <polygon id="Path" points="0 0 24 0 24 25 0 25"></polygon>
                                <g id="iconspace_Chat-3_25px"
                                  transform="translate(2.000000, 3.000000)" fill="#92929D">
                                  <path
                                    d="M10.5139395,15.2840977 L6.06545155,18.6848361 C5.05870104,19.4544672 3.61004168,18.735539 3.60795568,17.4701239 L3.60413773,15.1540669 C1.53288019,14.6559967 0,12.7858138 0,10.5640427 L0,4.72005508 C0,2.11409332 2.10603901,0 4.70588235,0 L15.2941176,0 C17.893961,0 20,2.11409332 20,4.72005508 L20,10.5640427 C20,13.1700044 17.893961,15.2840977 15.2941176,15.2840977 L10.5139395,15.2840977 Z M5.60638935,16.5183044 L9.56815664,13.4896497 C9.74255213,13.3563295 9.955971,13.2840977 10.1754888,13.2840977 L15.2941176,13.2840977 C16.7876789,13.2840977 18,12.0671403 18,10.5640427 L18,4.72005508 C18,3.21695746 16.7876789,2 15.2941176,2 L4.70588235,2 C3.21232108,2 2,3.21695746 2,4.72005508 L2,10.5640427 C2,12.0388485 3.1690612,13.2429664 4.6301335,13.28306 C5.17089106,13.297899 5.60180952,13.7400748 5.60270128,14.2810352 L5.60638935,16.5183044 Z"
                                    id="Path"></path>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <div className="text-sm	">10 Comments</div>
            </div>
            <div className="flex items-center	gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd" />
              </svg>
              <div className="text-sm">5 Likes</div>
            </div>
          </div> */}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeImage}
          >
            <Image src={selectedImage} className="max-w-4xl max-h-[90%] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} width={500} height={500} alt="Photo" />
            <button
              className="absolute top-5 right-5 text-white text-3xl hover:cursor-pointer"
              onClick={closeImage}
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </main>
  )
}