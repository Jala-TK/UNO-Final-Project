import { User } from "@/context/AuthContext"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps<{
  user: User | any
}> = async (ctx) => {
  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }
}

export default function Index() {
  return (
    <p>Olá</p>
  )
}