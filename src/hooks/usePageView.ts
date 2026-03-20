import { useEffect } from "react"
import { useRouter } from "next/router"

const usePageView = () => {
  const router = useRouter()

  useEffect(() => {
    const path = router.asPath

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {})
  }, [router.asPath])
}

export default usePageView
