import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import Map from '../components/Map'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ImageOverlay } from 'react-leaflet'
import { useStore } from '@tanstack/react-store'
import { loggedUserStore } from '../stores/loggedUser'
import { API_HOST_URL } from '../config'

type Temperature = {
  time: string
  imgName: string
}

export const Route = createLazyFileRoute('/temperature')({
  component: TemperaturePage,
})

function TemperaturePage() {
  const loggedUser = useStore(loggedUserStore)
  const navigate = useNavigate({ from: '/temperature' })
  if (!loggedUser.user || !loggedUser.jwt) {
    navigate({
      to: '/login',
    })
  }
  const [index, setIndex] = useState(0)
  const [selectedTemperature, setSelectedTemperature] = useState<
    Temperature | undefined
  >(undefined)

  async function getTemperatures(): Promise<Temperature[]> {
    const response = await fetch(`${API_HOST_URL}/temperature`, {
      headers: { Authorization: `Bearer ${loggedUser.jwt}` },
    })
    if (!response.ok) {
      if (response.status === 401) {
        navigate({ to: '/login' })
        console.error(
          'Fetching data from /temperature failed, missing authentication',
        )
        throw new Error(
          'Fetching data from /temperature failed, missing authentication',
        )
      }
      console.error('Fetching data from /temperature failed.')
      throw new Error('Fetching data from /temperature failed.')
    }

    return await response.json()
  }

  function nextIndex() {
    if (index === 23) {
      setIndex(0)
      return
    }
    setIndex((prev) => prev + 1)
  }

  const { data: temperatures } = useQuery({
    queryKey: ['links'],
    queryFn: getTemperatures,
  })

  useEffect(() => {
    if (temperatures) setSelectedTemperature(temperatures[index])
  }, [temperatures, index])

  return (
    <>
      <div className="absolute z-50 bottom-4 right-4 bg-red-500 p-1 flex gap-2">
        <button onClick={() => nextIndex()}>prev &gt;</button>
        <span>{selectedTemperature ? selectedTemperature.time : ''}</span>
      </div>
      <Map>
        <ImageOverlay
          opacity={0.8}
          url={`http://192.168.64.154:8080/${selectedTemperature?.imgName}`}
          bounds={[
            [48.5516, 12.0937],
            [51.0557, 18.8599],
          ]}
        />
      </Map>
    </>
  )
}
