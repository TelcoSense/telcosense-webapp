import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { loggedUserStore, updateLoggedUser } from '../stores/loggedUser'
import { useEffect } from 'react'
import Button from '../components/Button'
import { API_HOST_URL } from '../config'

export const Route = createLazyFileRoute('/login')({
  component: () => <LoginPage />,
})

function LoginPage() {
  const navigate = useNavigate()
  useEffect(() => {
    updateLoggedUser(undefined, undefined)
    localStorage.removeItem('user')
    localStorage.removeItem('jwt')
  }, [])
  async function login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; username: string; error?: string }> {
    const response = await fetch(`${API_HOST_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) {
      return {
        accessToken: '',
        username: '',
        error: 'Failed to login.',
      }
    }
    return await response.json()
  }
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const res = await login(
      String(formData.get('username')),
      String(formData.get('password')),
    )
    if (res.error) {
      window.alert(res.error)
      return
    }
    localStorage.setItem('jwt', res.accessToken)
    localStorage.setItem('user', res.username)
    updateLoggedUser(res.username, res.accessToken)
    navigate({ to: '/links' })
  }
  return (
    <div className="text-white flex justify-center items-center mt-4">
      <form
        onSubmit={handleLogin}
        className="w-4/5 sm:w-96 bg-gray-800 p-4 rounded-md flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xl font-bold">Username</label>
          <input name="username" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xl font-bold">Password</label>
          <input name="password" type="password" />
        </div>
        <Button className="p-2" type="submit">
          Login
        </Button>
      </form>
    </div>
  )
}
