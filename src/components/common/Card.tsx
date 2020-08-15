import styled from 'styled-components'

import { Flexbox } from './Flexbox'

export const Card = styled(Flexbox)<{ color?: string }>`
	background-color: ${({ color = '#252526' }): string => color};
	border-radius: 6px;
`
