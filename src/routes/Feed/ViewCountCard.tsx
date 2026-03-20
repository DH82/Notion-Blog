import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import { Emoji } from "src/components/Emoji"

const ViewCountCard: React.FC = () => {
  const [today, setToday] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/views")
      .then((res) => res.json())
      .then((data) => {
        setToday(data.today)
        setTotal(data.total)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <StyledTitle>
        <Emoji>👀</Emoji> Views
      </StyledTitle>
      <StyledWrapper>
        <div className="row">
          <span className="label">Today</span>
          <span className="value">{today ?? "-"}</span>
        </div>
        <div className="row">
          <span className="label">Total</span>
          <span className="value">{total ?? "-"}</span>
        </div>
      </StyledWrapper>
    </>
  )
}

export default ViewCountCard

const StyledTitle = styled.div`
  padding: 0.25rem;
  margin-bottom: 0.75rem;
`
const StyledWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
  flex-direction: column;
  border-radius: 1rem;
  margin-bottom: 2.25rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};

  .row {
    display: flex;
    padding: 0.75rem;
    justify-content: space-between;
    align-items: center;
    border-radius: 1rem;
    color: ${({ theme }) => theme.colors.gray11};

    .label {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .value {
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 600;
    }
  }
`
