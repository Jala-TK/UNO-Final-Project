import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Dashboard.module.css';
import { GetServerSideProps } from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { Box, Button, CircularProgress } from '@mui/material';
import { getAPIClient } from '@/services/axios';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["nextauth.tokenuno"]: token } = parseCookies(ctx);

  const currentRoute = ctx.req.url || "/";
  if (!token) {
    return {
      redirect: {
        destination: `/login?redirect=${encodeURIComponent(currentRoute)}`,
        permanent: false,
      },
    };
  }

  const apiClient = getAPIClient(ctx)
  let notAuth = false;

  let user;
  await apiClient.post('/api/auth/token', { token }).then((res) => {
    user = res.data
  }).catch(err => {
    notAuth = true;
  })

  if (notAuth) {
    return {
      redirect: {
        destination: `/login?redirect=${encodeURIComponent(currentRoute)}`,
        permanent: false
      }
    }
  }

  return {
    props: {
    },
  };
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const handleNavigation = async (path: string, buttonName: string) => {
    setLoading(true);
    setClickedButton(buttonName);
    await router.push(path);
    setLoading(false);
    setClickedButton(null);
  };

  async function handleExit() {
    setLoadingRequest(true)
    await destroyCookie(null, 'nextauth.tokenuno');
    router.push('/login');
  }
  const [loadingRequest, setLoadingRequest] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Box
          component="img"
          src="/assets/logo.png"
          alt='Logo'
          sx={{
            width: 228,
            height: 75,
          }}
        />
      </div>
      <div className={styles.panel}>
        <div className={styles.alignButton}>
          <div className={styles.button} onClick={() => handleNavigation('/registrar-ponto', 'ponto')}>
            {loading && clickedButton === 'ponto' ? (
              <CircularProgress size={24} />
            ) : (
              <Box
                component="img"
                className={styles.logo}
                src="/assets/Icone1.png"
                alt='registrar ponto'
                sx={{
                  cursor: 'pointer',
                  width: 100,
                  height: 100,
                }}
              />
            )}
          </div>
          <div className={styles.button} onClick={() => handleNavigation('/minhas-informacoes', 'informacoes')}>
            {loading && clickedButton === 'informacoes' ? (
              <CircularProgress size={24} />
            ) : (
              <Box
                component="img"
                className={styles.logo}
                src="/assets/Icone2.png"
                alt='minhas informações'
                sx={{
                  cursor: 'pointer',
                  width: 100,
                  height: 100,
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.alignButton}>
          <div className={styles.button} onClick={() => handleNavigation('/minhas-batidas', 'batidas')}>
            {loading && clickedButton === 'batidas' ? (
              <CircularProgress size={24} />
            ) : (

              <Box
                component="img"
                className={styles.logo}
                src="/assets/Icone3.png"
                alt='Minhas Batidas'
                sx={{
                  cursor: 'pointer',
                  width: 100,
                  height: 100,
                }}
              />
            )}
          </div>
          <div className={styles.button} onClick={() => handleNavigation('/minhas-justificativas', 'justificativas')}>
            {loading && clickedButton === 'justificativas' ? (
              <CircularProgress size={24} />
            ) : (
              <Box
                component="img"
                className={styles.logo}
                src="/assets/Icone4.png"
                alt='Minhas Justificativas'
                sx={{
                  cursor: 'pointer',
                  width: 100,
                  height: 100,
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.alignButton}>
          <Button className={styles.buttonExit} disabled={loadingRequest} variant="contained" onClick={handleExit}>Sair</Button>
        </div>
      </div>
    </div>
  );
}
