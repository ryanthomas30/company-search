import React from 'react'

import Spinner from 'react-loader-spinner'

type Types =
	| 'Audio'
	| 'BallTriangle'
	| 'Bars'
	| 'Circles'
	| 'Grid'
	| 'Hearts'
	| 'Oval'
	| 'Puff'
	| 'Rings'
	| 'TailSpin'
	| 'ThreeDots'
	| 'Watch'
	| 'RevolvingDot'
	| 'Triangle'
	| 'Plane'
	| 'MutatingDots'
	| 'None'
	| 'NotSpecified';

interface LoaderProps {
	type?: Types
	color?: string
	timeout?: number // in milliseconds
	size?: number
	visible?: boolean | string
}

export const Loader: React.FC<LoaderProps> = ({ type = 'ThreeDots', color = '#999', size = 45, ...rest }) => (
	<Spinner
		type={type}
		color={color}
		height={size}
		width={size}
		{...rest}
	/>
)
