import styled from 'styled-components'

import { Flexbox } from './Flexbox'

const Chip = styled(Flexbox)<{ color?: string }>`
	border-radius: 50px;
	padding: 0px 12px;
	height: 28px;
	font-size: 12px;
	background-color: ${({ color = '#333' }): string => color};
`

Chip.defaultProps = {
	direction: 'row',
	center: true,
}

export {
	Chip,
}
