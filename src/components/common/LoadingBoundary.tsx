import React, { FC, ReactNode } from 'react'

import { Flexbox, Loader } from './'

type Props = {
	fallBack?: ReactNode
	loading?: boolean
}

const defaultFallBack = (
	<Flexbox
		full='horizontal'
		padding='large'
		center
	>
		<Loader />
	</Flexbox>
)

export const LoadingBoundary: FC<Props> = ({ children, loading, fallBack = defaultFallBack }) => {
	if (!loading) {
		return <>{children}</>
	}
	return <>{fallBack}</>
}
