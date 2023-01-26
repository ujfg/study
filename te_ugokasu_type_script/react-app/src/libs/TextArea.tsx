import { VFC, useState, ChangeEvent } from "react"
import styled, { css } from "styled-components"
import { color, fontSize, radius, space } from "./constants"

type Props = {
  width?: number
  maxLength?: number
}

export const TextArea: VFC<Props> = ({ maxLength, width = 300 }) => {
  const [count, setCount] = useState<number>(0)
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCount(event.currentTarget.value.length)
  }
  const isError = () => {
    if (maxLength !== undefined && maxLength - count < 0) return true
    return false
  }

  return (
    <>
      <Wrapper onChange={handleChange} width={width} className={isError() ? 'error' : ''} />
      {maxLength !== undefined && (
        <Count className={isError() ? 'error' : ''}>
          残り{Math.max(maxLength - count, 0)}文字です
        </Count>
      )}
    </>
  )
}

const Wrapper = styled.textarea<{ width: number }>`
  height: 120pd;
  padding: ${space.m};
  border-radius: ${radius.m};
  border: solid 1px ${color.gray};
  font-size: ${fontSize.m};

  &.error {
    border: solid 1px ${color.red}
  }

  ${props =>
    css`
      width: ${props.width}px;
    `
  }
`

const Count = styled.p`
  margin: 0;
  font-size: ${fontSize.m};

  &.error {
    color: ${color.red}
  }
`