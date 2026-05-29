export type PropsWithClassName<T = object> = T & {
  className?: string
}

export type PropsWithChildren<T = object> = T & {
  children?: React.ReactNode
}
