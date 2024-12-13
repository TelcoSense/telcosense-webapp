import { LatLngExpression } from 'leaflet'

export type Link = {
  id: number
  ispId: number
  freqA: number
  freqB: number
  polar: string
  dist: number
  tech: string
  site1: LatLngExpression
  site2: LatLngExpression
}

export type Filter = {
  distMin: number
  distMax: number
  freqMin: number
  freqMax: number
  polarExclude: string[]
  tech: TechFilter
  techExclude: TechFilter
}

export type TechFilter = {
  orcave: string[]
  summit: string[]
  ceragon: string[]
  others: string[]
}

export type LinkDetailType = {
  show: boolean
  link?: Link
}
