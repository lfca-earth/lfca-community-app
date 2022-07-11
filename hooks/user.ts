import { useUserQuery } from '../services/lfca-backend'

export const useUser = () => {
  const [{ data, error, fetching }] = useUserQuery()

  return {
    error,
    fetching,
    isAdmin: !!data?.user.roles.includes('ADMIN'),
    isLeader: !!data?.user.roles.includes('LEADER'),
    isOfficer: !!data?.user.roles.includes('OFFICER'),
    programContentId: data?.user.company?.programContentId,
    user: data?.user,
  }
}
