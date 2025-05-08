export interface UserState {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    fechaNacimiento: string;
    categoria: string | null;
    dni: string;
    photoURL: string;
    admin: boolean;
  }