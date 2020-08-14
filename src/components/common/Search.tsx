import React, { FC } from 'react'

import styled from 'styled-components'

import { Flexbox } from './Flexbox'
import { Icon } from './Icon'

type Props = React.DetailedHTMLProps<
React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement
>

const BaseSearch: FC<Props> = ({ placeholder = 'Search', ...rest }) => (
	<Flexbox
		full='horizontal'
		style={{ position: 'relative' }}
	>
		<input
			placeholder={placeholder}
			{...rest}
		/>
		<SearchIcon
			icon='search'
			color='#555'
		/>
	</Flexbox>
)

export const Search = styled(BaseSearch)`
	width: -webkit-fill-available;
	border: none;
	padding: 12px 20px;
	padding-right: 36px;
	border-radius: 6px;
	background-color: #111;
	color: #888;
	transition: all 200ms ease-in-out;
	font-size: 14px;
	font-family: 'Nunito Sans';
	&:focus {
		outline: none;
	}
`

const SearchIcon = styled(Icon)`
	position: absolute;
	top: 13px;
	right: 14px;
	cursor: unset;
`
