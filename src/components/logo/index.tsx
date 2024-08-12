type Props = React.ComponentProps<'svg'>

export function Logo(props: Props) {
  return (
    <svg width="32" height="32" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0)">
        <rect x="7.07724" y="49.1611" width="6" height="30" rx="3" transform="rotate(13.6451 7.07724 49.1611)" className="fill-foreground" />
        <rect x="7.07724" y="49.1611" width="6" height="30" rx="3" transform="rotate(13.6451 7.07724 49.1611)" className="stroke-foreground" />
        <rect x="89.0772" y="49.1611" width="6" height="30" rx="3" transform="rotate(13.6451 89.0772 49.1611)" className="fill-foreground" />
        <rect x="89.0772" y="49.1611" width="6" height="30" rx="3" transform="rotate(13.6451 89.0772 49.1611)" className="stroke-foreground" />
        <rect x="22" y="20.2051" width="8" height="60.7371" rx="4" transform="rotate(-16 22 20.2051)" className="fill-foreground" />
        <rect x="67.7422" y="18" width="8" height="60.74" rx="4" transform="rotate(16 67.7422 18)" className="fill-blue-400" />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="96" height="96" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
