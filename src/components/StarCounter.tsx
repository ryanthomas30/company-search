import React from 'react'

import { Flexbox, Icon } from './'

interface Props {
	stars?: number
}

export const StarCounter: React.FC<Props> = ({ stars }) => {
	if (!stars) return null
	return (
		<Flexbox
			direction='row'
			align='center'
			marginBetween='small'
		>
			<Icon
				icon='star'
				size='lg'
			/>
			<h4>{stars}</h4>
		</Flexbox>
	)
}
