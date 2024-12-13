import { ComponentProps } from 'react'
import { Filter } from '../utils/types'
import CloseButton from './CloseButton'
import Button from './Button'

type FilterOwnProps = {
  filter: Filter
  setFilter: React.Dispatch<React.SetStateAction<Filter | undefined>>
  openFilter: boolean
  onOpen: () => void
  onClose: () => void
  className?: string
}

type FilterProps = FilterOwnProps &
  Omit<ComponentProps<'div'>, keyof FilterOwnProps>

const LinkFilter = ({
  filter,
  setFilter,
  openFilter,
  onOpen,
  onClose,
  className = '',
  ...rest
}: FilterProps) => {
  const onNumChange = (
    what: 'distMin' | 'distMax' | 'freqMin' | 'freqMax',
    value: number,
  ) => {
    const filterCopy = { ...filter }
    filterCopy[what] = value
    setFilter(filterCopy)
  }

  const onPolarChange = (polar: string) => {
    const filterCopy = { ...filter }
    if (filter.polarExclude.includes(polar)) {
      filterCopy.polarExclude = filterCopy.polarExclude.filter(
        (item) => item !== polar,
      )
      setFilter(filterCopy)
    } else {
      filterCopy.polarExclude = [...filterCopy.polarExclude, polar]
      setFilter(filterCopy)
    }
  }

  const onTechChange = (
    techCategory: 'orcave' | 'summit' | 'ceragon' | 'others',
    tech: string,
  ) => {
    const filterCopy = { ...filter }
    if (filter.techExclude[techCategory].includes(tech)) {
      filterCopy.techExclude[techCategory] = filterCopy.techExclude[
        techCategory
      ].filter((item) => item !== tech)
      setFilter(filterCopy)
      return
    }
    filterCopy.techExclude[techCategory] = [
      ...filterCopy.techExclude[techCategory],
      tech,
    ]
    setFilter(filterCopy)
  }

  const onTechCategoryChange = (
    techCategory: 'orcave' | 'summit' | 'ceragon' | 'others',
  ) => {
    const filterCopy = { ...filter }
    if (filterCopy.techExclude[techCategory].length === 0) {
      filterCopy.techExclude[techCategory] = filter.tech[techCategory]
      setFilter(filterCopy)
      return
    }
    filterCopy.techExclude[techCategory] = []
    setFilter(filterCopy)
  }

  return !openFilter ? (
    <div className="text-xl font-bold absolute z-[9999] top-3 right-3">
      <Button
        title="Filter"
        className="h-10 w-10 flex justify-center items-center shadow-gray-500 shadow-md"
        onClick={() => onOpen()}
      >
        <span className="material-icons text-white font-bold text-3xl">
          tune
        </span>
      </Button>
    </div>
  ) : (
    <div
      className={`flex flex-col gap-4 z-[9999] bg-gray-900 p-3 text-white ${className}`}
      {...rest}
    >
      <CloseButton
        className="fixed top-8 right-3 bg-gray-900 h-10 w-10"
        onClick={() => onClose()}
      />
      <div className="flex flex-col mt-2">
        <h2 className="text-2xl font-bold text-cyan-300">Distance</h2>
        <input
          type="number"
          className="bg-transparent"
          value={filter.distMin}
          onChange={(e) => onNumChange('distMin', Number(e.target.value))}
        />
        <input
          type="number"
          className="bg-transparent"
          value={filter.distMax}
          onChange={(e) => onNumChange('distMax', Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-cyan-300">Frequency</h2>
        <input
          type="number"
          className="bg-transparent"
          value={filter.freqMin}
          onChange={(e) => onNumChange('freqMin', Number(e.target.value))}
        />
        <input
          type="number"
          className="bg-transparent"
          value={filter.freqMax}
          onChange={(e) => onNumChange('freqMax', Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-cyan-300">Polarity</h2>
        <div className="text-white flex gap-2 items-center">
          <input
            className="w-5 h-5 accent-cyan-600"
            type="checkbox"
            checked={!filter.polarExclude.includes('V')}
            onChange={() => onPolarChange('V')}
          />
          V
        </div>
        <div className="text-white flex gap-2 items-center">
          <input
            className="w-5 h-5 accent-cyan-600"
            type="checkbox"
            checked={!filter.polarExclude.includes('H')}
            onChange={() => onPolarChange('H')}
          />
          H
        </div>
        <div className="text-white flex gap-2 items-center">
          <input
            className="w-5 h-5 accent-cyan-600"
            type="checkbox"
            checked={!filter.polarExclude.includes('X')}
            onChange={() => onPolarChange('X')}
          />
          X
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2">
        <h2 className="text-2xl font-bold text-cyan-300">Technology</h2>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-cyan-300 flex gap-2 items-center">
            <input
              className="w-6 h-6 accent-cyan-600"
              type="checkbox"
              checked={filter.techExclude.summit.length === 0}
              onChange={() => onTechCategoryChange('summit')}
            />
            Summit
          </h2>
          {filter.tech.summit.map((tech) => {
            return (
              <div key={tech} className="flex gap-2 items-center ml-4">
                <input
                  className="w-5 h-5 accent-cyan-600"
                  type="checkbox"
                  checked={!filter.techExclude.summit.includes(tech)}
                  onChange={() => onTechChange('summit', tech)}
                />
                <label>{tech}</label>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-cyan-300 flex gap-2 items-center">
            <input
              className="w-6 h-6 accent-cyan-600"
              type="checkbox"
              checked={filter.techExclude.ceragon.length === 0}
              onChange={() => onTechCategoryChange('ceragon')}
            />
            Ceragon
          </h2>
          {filter.tech.ceragon.map((tech) => {
            return (
              <div key={tech} className="flex gap-2 items-center ml-4">
                <input
                  className="w-5 h-5 accent-cyan-600"
                  type="checkbox"
                  checked={!filter.techExclude.ceragon.includes(tech)}
                  onChange={() => onTechChange('ceragon', tech)}
                />
                <label>{tech}</label>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-cyan-300 flex gap-2 items-center">
            <input
              className="w-6 h-6 accent-cyan-600"
              type="checkbox"
              checked={filter.techExclude.orcave.length === 0}
              onChange={() => onTechCategoryChange('orcave')}
            />
            Orcave
          </h2>
          {filter.tech.orcave.map((tech) => {
            return (
              <div key={tech} className="flex gap-2 items-center ml-4">
                <input
                  className="w-5 h-5 accent-cyan-600"
                  type="checkbox"
                  checked={!filter.techExclude.orcave.includes(tech)}
                  onChange={() => onTechChange('orcave', tech)}
                />
                <label>{tech}</label>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-cyan-300 flex gap-2 items-center">
            <input
              className="w-6 h-6 accent-cyan-600"
              type="checkbox"
              checked={filter.techExclude.others.length === 0}
              onChange={() => onTechCategoryChange('others')}
            />
            Others
          </h2>
          {filter.tech.others.map((tech) => {
            return (
              <div key={tech} className="flex gap-2 items-center ml-4">
                <input
                  className="w-5 h-5 accent-cyan-600"
                  type="checkbox"
                  checked={!filter.techExclude.others.includes(tech)}
                  onChange={() => onTechChange('others', tech)}
                />
                <label>{tech}</label>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LinkFilter
