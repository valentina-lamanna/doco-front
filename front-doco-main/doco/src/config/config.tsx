export const BACK_URL: string = process.env.NEXT_PUBLIC_BACK_URL
  ? process.env.NEXT_PUBLIC_BACK_URL
  : "http://localhost"; //todo: esto falla, ahcer que funcione bien
export const BACK_PORT: number = parseInt(
  process.env.NEXT_PUBLIC_BACK_PORT ? process.env.NEXT_PUBLIC_BACK_PORT : "3001"
);
export const FRONT_URL: string = process.env.NEXT_PUBLIC_FRONT_URL
  ? process.env.NEXT_PUBLIC_FRONT_URL
  : "http://localhost";
export const FRONT_PORT: number = parseInt(
  process.env.NEXT_PUBLIC_FRONT_PORT ? process.env.NEXT_PUBLIC_FRONT_PORT : "3000"
);
export const FRONT_FULL_URL: string = FRONT_URL + ":" + FRONT_PORT;

export const BACK_FULL_URL: string = BACK_URL + ":" + BACK_PORT;
