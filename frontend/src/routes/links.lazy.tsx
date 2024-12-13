import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Map from '../components/Map'
import { Polyline } from 'react-leaflet'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Filter, Link, LinkDetailType, TechFilter } from '../utils/types'
import LinkFilter from '../components/LinkFilter'
import Spinner from '../components/Spinner'
import LinkDetail from '../components/LinkDetail'
import { useStore } from '@tanstack/react-store'
import { loggedUserStore } from '../stores/loggedUser'
import { API_HOST_URL } from '../config'

export const Route = createFileRoute('/links')({
  component: LinksPage,
})

function LinksPage() {
  const loggedUser = useStore(loggedUserStore)
  const navigate = useNavigate({ from: '/links' })
  if (!loggedUser.user || !loggedUser.jwt) {
    navigate({
      to: '/login',
    })
  }
  const [filter, setFilter] = useState<Filter | undefined>(undefined)
  const [linkDetail, setLinkDetail] = useState<LinkDetailType>({
    show: false,
    link: undefined,
  })
  const [openFilter, setOpenFilter] = useState(false)

  const { data } = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await fetch(`${API_HOST_URL}/links`, {
        headers: { Authorization: `Bearer ${loggedUser.jwt}` },
      })
      if (!response.ok) {
        if (response.status === 401) {
          navigate({ to: '/login' })
          console.error(
            'Fetching data from /links failed, missing authentication',
          )
          throw new Error(
            'Fetching data from /links failed, missing authentication',
          )
        }
        console.error('Fetching data from /links failed.')
        throw new Error('Fetching data from /links failed.')
      }
      return await response.json()
    },
  })

  useEffect(() => {
    if (!data) return
    let techFilter: TechFilter = {
      orcave: [],
      summit: [],
      ceragon: [],
      others: [],
    }
    data.forEach((item: Link) => {
      if (item.tech.toLowerCase().includes('orcave')) {
        if (techFilter.orcave.includes(item.tech)) return
        techFilter.orcave.push(item.tech)
      } else if (item.tech.toLowerCase().includes('summit')) {
        if (techFilter.summit.includes(item.tech)) return
        techFilter.summit.push(item.tech)
      } else if (item.tech.toLowerCase().includes('ceragon')) {
        if (techFilter.ceragon.includes(item.tech)) return
        techFilter.ceragon.push(item.tech)
      } else {
        if (techFilter.others.includes(item.tech)) return
        techFilter.others.push(item.tech)
      }
    })
    setFilter(() => {
      return {
        distMin: 0,
        distMax: 9999999,
        freqMin: 0,
        freqMax: 9999999,
        polarExclude: [],
        tech: techFilter,
        techExclude: {
          orcave: [],
          ceragon: [],
          summit: [],
          others: [],
        },
      }
    })
  }, [data])

  return (
    <>
      {data && filter && (
        <div className="absolute w-full h-[96%] md:w-1/3 lg:w-1/4 md:right-0 overflow-scroll">
          <LinkFilter
            className="relative w-full h-full overflow-scroll"
            filter={filter}
            setFilter={setFilter}
            openFilter={openFilter}
            onOpen={() => {
              setLinkDetail({ show: false, link: undefined })
              setOpenFilter(true)
            }}
            onClose={() => setOpenFilter(false)}
          />
        </div>
      )}
      {data && linkDetail.show && linkDetail.link && (
        <div className="absolute bottom-0 md:bottom-8 w-full flex justify-center">
          <LinkDetail
            className="relative w-full md:w-[70%] md:rounded-md"
            link={linkDetail.link}
            onClose={() => setLinkDetail({ show: false, link: undefined })}
          />
        </div>
      )}
      <Map>
        {data && filter ? (
          <Links data={data} filter={filter} setLinkDetail={setLinkDetail} />
        ) : (
          <div className="absolute z-[9999] w-screen h-screen flex items-center justify-center bg-gray-50/50">
            <Spinner className="w-40 h-40" />
          </div>
        )}
      </Map>
    </>
  )
}

function Links({
  data,
  filter,
  setLinkDetail,
}: {
  data: Link[]
  filter: Filter
  setLinkDetail: React.Dispatch<React.SetStateAction<LinkDetailType>>
}) {
  return (
    <>
      {data.map((link: Link) => {
        return (
          <LinkComponent
            link={link}
            filter={filter}
            key={link.id}
            setLinkDetail={setLinkDetail}
          />
        )
      })}
    </>
  )
}

function LinkComponent({
  link,
  filter,
  setLinkDetail,
}: {
  link: Link
  filter: Filter
  setLinkDetail: React.Dispatch<React.SetStateAction<LinkDetailType>>
}) {
  const getTechCategory = (linkTech: string) => {
    if (linkTech.toLowerCase().includes('orcave')) return 'orcave'
    else if (linkTech.toLowerCase().includes('summit')) return 'summit'
    else if (linkTech.toLowerCase().includes('ceragon')) return 'ceragon'
    else return 'others'
  }
  const isDisplayed =
    link.dist >= filter.distMin &&
    link.dist <= filter.distMax &&
    link.freqA >= filter.freqMin &&
    link.freqA <= filter.freqMax &&
    link.freqB >= filter.freqMin &&
    link.freqB <= filter.freqMax &&
    !filter.polarExclude.includes(link.polar) &&
    !filter.techExclude[getTechCategory(link.tech)].includes(link.tech)
  if (!isDisplayed) return undefined
  return (
    <Polyline
      pathOptions={{
        color: 'red',
        weight: 4,
      }}
      eventHandlers={{
        click: () => {
          setLinkDetail({ show: true, link: link })
        },
      }}
      positions={[link.site1, link.site2]}
    />
  )
}
