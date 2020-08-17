import React from 'react'

import numeral from 'numeral'

import { Flexbox, Icon } from './'

interface Props {
	/**
	 * Number of stars.
	 */
	stars?: number | null
}

/**
 * Component that renders the number of stars a GitHub repository has.
 */
export const StarCounter: React.FC<Props> = ({ stars }) => {
	if (!stars) return null
	return (
		<Flexbox
			direction='row'
			align='center'
			marginBetween={6}
		>
			<Icon
				icon='star'
				size='lg'
			/>
			<h4>{numeral(stars).format('0,0')}</h4>
		</Flexbox>
	)
}
