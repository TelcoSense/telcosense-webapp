import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import Map from '../components/Map'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ImageOverlay } from 'react-leaflet'
import Spinner from '../components/Spinner'
import { useStore } from '@tanstack/react-store'
import { loggedUserStore } from '../stores/loggedUser'
import Button from '../components/Button'
import { API_HOST_URL } from '../config'

type Rain = {
  time: string
  imgName: string
}

export const Route = createLazyFileRoute('/')({
  component: RainPage,
})

function RainPage() {
  const loggedUser = useStore(loggedUserStore)
  const navigate = useNavigate({ from: '/' })
  if (!loggedUser.user || !loggedUser.jwt) {
    navigate({
      to: '/login',
    })
  }
  const [index, setIndex] = useState(23)
  const [selectedRain, setSelectedRain] = useState<Rain | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [rainTimeRange, setRainTimeRange] = useState({
    from: '2024-08-18 23:20:00',
    to: '2024-08-19 03:10:00',
  })
  const [maxTimeRange, setMaxTimeRange] = useState(23)
  let interval: number

  async function getRain(): Promise<Rain[]> {
    const response = await fetch(`${API_HOST_URL}/rain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loggedUser.jwt}`,
      },
      body: JSON.stringify(rainTimeRange),
    })
    if (!response.ok) {
      if (response.status === 401) {
        navigate({ to: '/login' })
        console.error('Fetching data from /rain failed, missing authentication')
        throw new Error(
          'Fetching data from /rain failed, missing authentication',
        )
      }
      console.error('Fetching data from /rain failed.')
      throw new Error('Fetching data from /rain failed.')
    }

    return await response.json()
  }

  const { data: rain, refetch } = useQuery({
    queryKey: ['rain'],
    queryFn: getRain,
  })

  function handlePlayClick() {
    setIsPlaying((prev) => !prev)
  }

  function handleRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIndex(Number(e.target.value))
  }

  function submitRainTimeRangeForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    setRainTimeRange({
      from: String(formData.get('from')),
      to: String(formData.get('to')),
    })
  }

  useEffect(() => {
    refetch()
  }, [rainTimeRange])

  useEffect(() => {
    if (rain) {
      setMaxTimeRange(rain.length - 1)
      setSelectedRain(rain[index])
    }
  }, [rain, index])

  useEffect(() => {
    if (!isPlaying) {
      window.clearInterval(interval)
      return
    }

    interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === maxTimeRange) return 0
        return prev + 1
      })
    }, 1200)

    return () => {
      window.clearInterval(interval)
    }
  }, [isPlaying, maxTimeRange])

  return (
    <>
      <div className="absolute bottom-0 md:bottom-8 w-full flex justify-center z-[9999]">
        <div className="flex flex-col justify-center items-center bg-gray-900 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 md:rounded-md py-2 text-white">
          <div className="flex flex-col justify-center items-center mb-2">
            <Button
              onClick={handlePlayClick}
              className="p-2 bg-white w-10 h-10 flex justify-center items-center"
            >
              {isPlaying ? (
                <span className="material-icons">pause</span>
              ) : (
                <span className="material-icons">play_arrow</span>
              )}
            </Button>
            <span>{selectedRain ? selectedRain.time : ''}</span>
            <input
              className="accent-cyan-500"
              type="range"
              value={index}
              max={maxTimeRange}
              onChange={handleRangeChange}
            />
          </div>
          <form
            onSubmit={submitRainTimeRangeForm}
            className="flex flex-col items-center"
          >
            <div className="grid grid-cols-3 w-3/4 gap-1 bg-gray-800 p-2 rounded-md">
              <label>From:</label>
              <input
                className="col-span-2 text-center bg-gray-950 text-white"
                type="text"
                name="from"
                id="from"
                defaultValue={rainTimeRange.from}
              />
              <label>To:</label>
              <input
                className="col-span-2 text-center bg-gray-950 text-white"
                type="text"
                name="to"
                id="to"
                defaultValue={rainTimeRange.to}
              />
            </div>
            <Button className="p-2 mt-2" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
      <Map>
        {rain ? (
          <ImageOverlay
            opacity={0.8}
            url={`http://192.168.64.154:8080/${selectedRain?.imgName}`}
            bounds={[
              [48.5516, 12.0937],
              [51.0557, 18.8599],
            ]}
          />
        ) : (
          <Spinner className="absolute w-40 h-40 top-1/2 left-1/2" />
        )}
      </Map>
    </>
  )
}
