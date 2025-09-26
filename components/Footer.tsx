'use client'

import { useEffect } from 'react'

export default function Footer() {
  useEffect(() => {
    if (!(window as any).GitHubButton) {
      const script = document.createElement("script")
      script.src = "https://buttons.github.io/buttons.js"
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    } else {
      (window as any).GitHubButton.render()
    }
  }, [])

  return (
    <footer className="fixed bottom-4 left-0 w-full text-center text-white z-50">
      <a
        href="https://j3d.jessejesse.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 inline-block text-gray-50 hover:text-yellow-400 transition-colors duration-300 cursor-pointer"
      >
     𝕁3𝔻.𝕁𝕖𝕤𝕤𝕖𝕁𝕖𝕤𝕤𝕖.𝕔𝕠𝕞
      </a>

      <div>
        <a
          className="github-button"
          href="https://github.com/sudo-self/jesse3d"
          data-color-scheme="no-preference: light_high_contrast; light: light_high_contrast; dark: light_high_contrast;"
          data-icon="octicon-star"
          data-size="large"
          aria-label="Star sudo-self/jesse3d on GitHub"
        >
          Star
        </a>
      </div>
    </footer>
  )
}

