import { Timestamp } from 'firebase/firestore';

export interface PostsInterface {
    createdAt: Timestamp;
    description: string;
    imageUrls: string[];
    userId: string;
}

export interface UserNotification {
    id: string
    name: string
    surname: string
    photoUrl: string
}