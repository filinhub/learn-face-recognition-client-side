// types.ts

export type FaceRegisterState = 'front' | 'left' | 'right' | 'down' | 'up';

export interface FaceRegisterRequest {
  state: FaceRegisterState;
}

export interface FaceRegisterResponse {
  status: 'ok' | 'error';
  message: string;
}
