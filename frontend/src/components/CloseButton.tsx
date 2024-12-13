import { ComponentProps } from 'react'

type CloseButtonOwnProps = {
  className?: string
}

type CloseButtonProps = CloseButtonOwnProps &
  Omit<ComponentProps<'button'>, keyof CloseButtonOwnProps>

const CloseButton = ({
  className = '',
  onClick,
  ...rest
}: CloseButtonProps) => {
  return (
    <button
      className={`text-red-500 ${className}`}
      {...rest}
      onClick={(e) => onClick?.(e)}
    >
      <span className="material-icons font-extrabold text-3xl">close</span>
    </button>
  )
}

export default CloseButton
