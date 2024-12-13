import { ComponentProps } from 'react'
import { Link } from '../utils/types'
import CloseButton from './CloseButton'

type LinkDetailOwnProps = {
  link: Link
  onClose: () => void
  className?: string
}

type LinkDetailProps = LinkDetailOwnProps &
  Omit<ComponentProps<'div'>, keyof LinkDetailOwnProps>

const LinkDetail = ({
  link,
  onClose,
  className = '',
  ...rest
}: LinkDetailProps) => {
  return (
    <div
      className={`grid grid-cols-2 gap-4 z-[9999] bg-gray-900 p-2 text-white ${className}`}
      {...rest}
    >
      <div className="font-bold">
        <div>ID</div>
        <div>ISP ID</div>
        <div>Technology</div>
        <div>Distance</div>
        <div>Polarization</div>
        <div>Frequency A</div>
        <div>Frequency B</div>
      </div>
      <div>
        <div>{link.id}</div>
        <div>{link.ispId}</div>
        <div>{link.tech}</div>
        <div>{link.dist}</div>
        <div>{link.polar}</div>
        <div>{link.freqA}</div>
        <div>{link.freqB}</div>
      </div>
      <CloseButton className="absolute top-1 right-1" onClick={onClose} />
    </div>
  )
}

export default LinkDetail
