import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        bgHeader: 'rgba(94, 57, 31, 0.1)',
        bgSideBar: 'rgba(239,236,233,0.3)',
        bgHoverSideBar: 'white',
        bgDefault: '#FAFAFA',
        bgPrimary: '#856655',
        bgSecondary: '#FAFAFA',
        textDefault: '#4D2E1C',
        textPrimary: '#FFFFFF',
        textSuccess: '#43C26D',
        textFail: '#FF0000',
        textBtnPrimary: '#E2E2E2',
        borderSideBarDefault: '#EFECE9',
        borderDefault: '#C8C8C8',
        borderPrimary: '#AA9E9E',
        bgBtnDefault: '#F5F5F5',
        bgBtnPrimary: '#856655',
        inputFocus: '#856655',
      },
      screens: {
        'h-md': { raw: '(min-height: 600px)' }, // 세로 600px 이상일 때
        'h-lg': { raw: '(min-height: 800px)' }, // 세로 800px 이상일 때
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
