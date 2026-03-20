import { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"

const AdSenseCard: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null)
  const isAdPushed = useRef(false)

  useEffect(() => {
    if (!CONFIG?.googleAdsense?.enable) return
    if (isAdPushed.current) return

    try {
      const adsbygoogle = (window as any).adsbygoogle || []
      adsbygoogle.push({})
      isAdPushed.current = true
    } catch (e) {
      console.error("AdSense error:", e)
    }
  }, [])

  if (!CONFIG?.googleAdsense?.enable) return null

  return (
    <StyledWrapper>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CONFIG.googleAdsense.config.publisherId}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </StyledWrapper>
  )
}

export default AdSenseCard

const StyledWrapper = styled.div`
  margin-top: 1rem;
`
