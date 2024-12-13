import { ComponentProps } from 'react'

type ButtonOwnProps = {
  className?: string
}

type ButtonProps = ButtonOwnProps &
  Omit<ComponentProps<'button'>, keyof ButtonOwnProps>

const Button = ({ className = '', children, ...rest }: ButtonProps) => {
  return (
    <button
      className={`bg-cyan-500 hover:bg-cyan-700 active:bg-cyan-800 rounded-md text-xl font-extrabold ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
