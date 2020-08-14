import React, { FC } from 'react'

import { Flexbox, FlexboxProps } from './Flexbox'

/**
 * Flex row wrapper for `Flexbox`. Takes the same props with some defaults.
 * @defaults `full='horizontal` `direction='row'` `align='center'`
 */
export const Row: FC<FlexboxProps> = ({ children, ...other }: FlexboxProps) => (
	<Flexbox
		full='horizontal'
		direction='row'
		align='center'
		{...other}
	>
		{children}
	</Flexbox>
)
