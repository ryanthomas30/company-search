import React, { FC } from 'react'

import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

interface IconProps extends FontAwesomeIconProps {
	color?: string
	className?: string
	onClick?: (e: React.MouseEvent<SVGElement>) => void
}

export const Icon: FC<IconProps> = ({
	color = '#999',
	className,
	onClick,
	...other
}) => (
	<StyledFontAwesomeIcon
		onClick={onClick}
		color={color}
		className={className}
		{...other}
	/>
)

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
	transition: all 80ms ease-in-out;

	${(props): string => {
		if (props.onClick) {
			return `
				cursor: pointer;

				&:hover {
					filter: brightness(150%);
				}
			`
		}
		return ''
	}}
`
