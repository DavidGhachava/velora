import type { ImgHTMLAttributes } from 'react'

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'srcSet'> {
  src: string
  alt: string
}

export function ResponsiveImage({ src, alt, sizes = '100vw', decoding = 'async', ...props }: ResponsiveImageProps) {
  const isLargeHero = src.endsWith('-2560.webp')
  const small = src.replace(isLargeHero ? '-2560.webp' : '-1600.webp', '-640.webp')
  const medium = isLargeHero ? src.replace('-2560.webp', '-1600.webp') : src
  const srcSet = small === src ? undefined : isLargeHero ? `${small} 640w, ${medium} 1600w, ${src} 2560w` : `${small} 640w, ${src} 1600w`

  return <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} width={isLargeHero ? 2560 : 1600} height={isLargeHero ? 1440 : 1000} decoding={decoding} alt={alt} {...props} />
}
