import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true, // styled-components 사용 설정
  },
  images: {
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
  },
}

export default nextConfig
