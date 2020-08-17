import React, { FC, useState } from 'react'

import styled from 'styled-components'

import { Flexbox, Row, Icon, Card } from './'

interface Props extends React.DetailedHTMLProps<
React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement
> {
	searchResults?: SearchResult[]
	onResultSelect?: (value: string) => void
	onEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export interface SearchResult {
	image: string
	title: string
	value: string
}

const wait = (time: number): Promise<void> => new Promise(resolve => setTimeout(resolve, time))

const BaseSearch: FC<Props> = ({ placeholder = 'Search', onKeyDown, onEnter, searchResults, onResultSelect, onFocus, onBlur, ...rest }) => {
	const [isFocused, setIsFocused] = useState<boolean>(false)

	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(true)
		if (onFocus) onFocus(event)
	}

	const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
		if (onBlur) onBlur(event)
		await wait(100)
		setIsFocused(false)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			onEnter(event)
			setIsFocused(false)
		}
		if (onKeyDown) onKeyDown(event)
	}

	return (
		<Flexbox
			full='horizontal'
			style={{ position: 'relative' }}
		>
			<input
				placeholder={placeholder}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				{...rest}
			/>
			<SearchIcon
				icon='search'
				color='#555'
			/>
			{isFocused && searchResults && searchResults.length !== 0 && (
				<SearchResults
					full='horizontal'
					color='#333'
					overflow='hidden'
				>
					{searchResults.map(result => (
						<SearchResult
							key={result.title}
							marginBetween='small'
							padding='small'
							onClick={() => {
								if (onResultSelect) onResultSelect(result.value)
								setIsFocused(false)
							}}
						>
							<Image src={result.image} />
							<h3>{result.title}</h3>
						</SearchResult>
					))}
				</SearchResults>
			)}
		</Flexbox>
	)
}

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

const SearchResults = styled(Card)`
	position: absolute;
	top: 45px;
	z-index: 500;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`

const SearchResult = styled(Row)`
	transition: all 80ms ease-in-out;
	&:hover {
		background-color: #444;
	}
`

const Image = styled.img`
	object-fit: cover;
	height: 30px;
	width: 30px;
	border-radius: 50%;
`
