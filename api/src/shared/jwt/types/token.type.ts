export type GenerateTokenProps = {
  id: string;
  email: string;
}

export type TokenProps = {
  id: string;
  email: string;
  rol: string;
  iat: number;
  exp: number;
}
