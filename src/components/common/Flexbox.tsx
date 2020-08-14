import React, {
	ReactNode,
	CSSProperties,
	forwardRef,
	MouseEventHandler,
	FocusEventHandler,
	KeyboardEventHandler,
} from 'react'

import styled from 'styled-components'

const sizeMap: { [key: string]: string } = {
	xs: '6px',
	small: '12px',
	medium: '24px',
	large: '48px',
}

const spacingMap: { [key: string]: string } = {
	start: 'flex-start',
	end: 'flex-end',
	between: 'space-between',
}

const format = (value?: string | number): string | undefined =>
	typeof value === 'number' ? `${value}px` : value

const getSpacing = (input?: string): string => {
	if (!input) return ''
	return input in spacingMap ? spacingMap[input] : input
}

const getSize = (input?: Size): string | undefined => {
	if (!input) return ''
	return input in sizeMap ? sizeMap[input] : format(input)
}

export interface FlexboxProps {
	children?: ReactNode
	/* Flex Properties */
	direction?: 'row' | 'column'
	justify?: SpacingJustify
	align?: SpacingAlign
	center?: boolean
	wrap?: boolean
	flex?: string
	/* Margin */
	margin?: Size
	marginLeft?: Size
	marginRight?: Size
	marginTop?: Size
	marginBottom?: Size
	marginVertical?: Size
	marginHorizontal?: Size
	marginBetween?: Size
	/* Padding */
	padding?: Size
	paddingLeft?: Size
	paddingRight?: Size
	paddingTop?: Size
	paddingBottom?: Size
	paddingVertical?: Size
	paddingHorizontal?: Size
	paddingBetween?: Size
	className?: string
	overflow?: string
	/* Size */
	full?: boolean | 'vertical' | 'horizontal'
	height?: number | string
	width?: number | string
	minHeight?: number | string
	maxHeight?: number | string
	minWidth?: number | string
	maxWidth?: number | string
	/* Events */
	onClick?: MouseEventHandler
	onBlur?: FocusEventHandler
	onKeyDown?: KeyboardEventHandler
	/* Utility */
	title?: string
	type?: 'button' | 'reset' | 'submit'
	tag?: 'div' | 'span' | 'form' | 'button'
	tabIndex?: number | undefined
	userSelect?: boolean
	style?: CSSProperties
}

type Size = 'xs' | 'small' | 'medium' | 'large' | number

type SpacingBase = 'start' | 'end' | 'center'
type SpacingJustify = SpacingBase | 'between'
type SpacingAlign = SpacingBase | 'baseline'

const BaseFlexbox = forwardRef(function Flexbox(props: FlexboxProps, ref): JSX.Element {
	const {
		children,
		justify = '',
		align = 'start',
		center,
		wrap = false,
		/* Margin */
		margin,
		marginLeft,
		marginRight,
		marginTop,
		marginBottom,
		marginVertical,
		marginHorizontal,
		/* Padding */
		padding,
		paddingLeft,
		paddingRight,
		paddingTop,
		paddingBottom,
		paddingVertical,
		paddingHorizontal,
		/* Height & Width */
		full,
		height,
		width,
		minHeight,
		maxHeight,
		minWidth,
		maxWidth,
		/* Events */
		onClick,
		onBlur,
		onKeyDown,
		/* Misc */
		title,
		type,
		tag = 'div',
		tabIndex,
		userSelect,
		className,
		style,
	} = props

	/* FLEX */
	const justifyContent = center ? getSpacing('center') : getSpacing(justify)
	const alignItems = center ? getSpacing('center') : getSpacing(align)
	const flexWrap = wrap ? 'wrap' : 'nowrap'

	/* FULL, HEIGHT, WIDTH */
	interface SizeObject {
		width?: string
		height?: string
		minHeight?: string
		maxHeight?: string
		minWidth?: string
		maxWidth?: string
	}
	const sizeObj: SizeObject = {
		height: format(height),
		width: format(width),
		minHeight: format(minHeight),
		maxHeight: format(maxHeight),
		minWidth: format(minWidth),
		maxWidth: format(maxWidth),
	}

	if (full === true) {
		sizeObj.width = '100%'
		sizeObj.height = '100%'
	} else if (full === 'vertical') {
		sizeObj.height = '100%'
	} else if (full === 'horizontal') {
		sizeObj.width = '100%'
	}

	/* PADDING */
	type PaddingProperties = 'padding' | 'paddingLeft' | 'paddingRight' | 'paddingTop' | 'paddingBottom'
	type PaddingPartial = Pick<CSSProperties, PaddingProperties>
	const paddingProperties: PaddingPartial = { padding, paddingLeft, paddingRight, paddingTop, paddingBottom }

	paddingProperties.padding = getSize(padding)

	paddingProperties.paddingTop = paddingVertical ? getSize(paddingVertical) : getSize(paddingTop)
	paddingProperties.paddingBottom = paddingVertical ? getSize(paddingVertical) : getSize(paddingBottom)

	paddingProperties.paddingLeft = paddingHorizontal ? getSize(paddingHorizontal) : getSize(paddingLeft)
	paddingProperties.paddingRight = paddingHorizontal ? getSize(paddingHorizontal) : getSize(paddingRight)

	/* MARGIN */
	type MarginProperties = 'margin' | 'marginLeft' | 'marginRight' | 'marginTop' | 'marginBottom'
	type MarginPartial = Pick<CSSProperties, MarginProperties>
	const marginProperties: MarginPartial = { margin, marginLeft, marginRight, marginTop, marginBottom }

	marginProperties.margin = getSize(margin)

	marginProperties.marginTop = marginVertical ? getSize(marginVertical) : getSize(marginTop)
	marginProperties.marginBottom = marginVertical ? getSize(marginVertical) : getSize(marginBottom)

	marginProperties.marginLeft = marginHorizontal ? getSize(marginHorizontal) : getSize(marginLeft)
	marginProperties.marginRight = marginHorizontal ? getSize(marginHorizontal) : getSize(marginRight)

	/* UTILITY */
	type UtilityProperties = 'userSelect'
	type UtilityPartial = Pick<CSSProperties, UtilityProperties>
	const utilityProperties: UtilityPartial = {}

	if (userSelect === false) {
		utilityProperties.userSelect = 'none'
	}

	/* Merges props with style object */
	const styleObject: CSSProperties = {
		display: 'flex',
		boxSizing: 'border-box',
		justifyContent,
		alignItems,
		flexWrap,
		...paddingProperties,
		...marginProperties,
		...sizeObj,
		...utilityProperties,
		...style,
	}

	/* Delete undefined fields */
	Object.keys(styleObject).forEach((key) => {
		// @ts-ignore For each types key as string
		if (styleObject[key] === undefined || styleObject[key] === '') delete styleObject[key]
	})

	const Element = tag
	return (
		<Element
			style={styleObject}
			className={className}
			title={title}
			onClick={onClick}
			onBlur={onBlur}
			onKeyDown={onKeyDown}
			type={type}
			ref={ref as string | (string & ((instance: HTMLElement | null) => void))}
			tabIndex={tabIndex}
		>
			{children}
		</Element>
	)
})

export const Flexbox = styled(BaseFlexbox)`
	cursor: ${({ onClick }): string | undefined => onClick ? 'pointer' : undefined};
	flex: ${({ flex }): string | undefined => flex};
	flex-direction: ${({ direction }): string => direction || 'column'};
	overflow: ${({ overflow }): string | undefined => overflow};
	> *:not(:last-child) {
		margin-bottom: ${({ direction, marginBetween }): string | undefined => direction === 'column'
			|| !direction ? getSize(marginBetween) : undefined};

		margin-right: ${({ direction, marginBetween }): string | undefined => direction === 'row' ? getSize(marginBetween) : undefined};

		padding-bottom: ${({ direction, paddingBetween }): string | undefined => direction === 'column'
			|| !direction ? getSize(paddingBetween) : undefined};

		padding-right: ${({ direction, paddingBetween }): string | undefined => direction === 'row' ? getSize(paddingBetween) : undefined};
	}
`
