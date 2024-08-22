import crypto from 'crypto';

export async function Cripto(value: string) {
  const hash = crypto.createHash('sha256');
  hash.update(value);
  const cryptoSenha = hash.digest('hex');
  return cryptoSenha;
}
