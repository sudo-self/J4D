'use client'

import { useEffect } from 'react'

export default function Footer() {
  useEffect(() => {
    if (!(window as any).GitHubButton) {
      const script = document.createElement("script");
      script.src = "https://buttons.github.io/buttons.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      (window as any).GitHubButton.render();
    }
  }, []);

  return (
    <footer className="fixed bottom-4 left-0 w-full text-center text-white z-50">
      <div className="mb-2 hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
        ᴶᵉˢˢᵉ³ᵈ @𝕣𝕖𝕒𝕔𝕥-𝕥𝕙𝕣𝕖𝕖/𝕗𝕚𝕓𝕖𝕣
      </div>
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
    </footer>
  )
}
