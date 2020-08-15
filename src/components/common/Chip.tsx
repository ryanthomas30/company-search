import styled from 'styled-components'

export const Chip = styled.div<{ color?: string }>`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50px;
	padding: 0px 12px;
	height: 28px;
	font-size: 12px;
	background-color: ${({ color = '#333' }): string => color};
`
