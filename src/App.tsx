import React, { useState } from 'react'

import { useCrunchBaseCompany, useGitHubData, useSearchResults } from './api'
import { Flexbox, Card, CompanyCard, Page, Search, Chip, Icon } from './components'
import { Company } from './model'

const App = () => {
	/* STATE */
	const [searchValue, setSearchValue] = useState<string>('')
	const [currentQuery, setCurrentQuery] = useState<string>('')
	const [company, setCompany] = useState<Partial<Company> | null>(null)

	const [fetchGitHubData, { loading: gitHubLoading }] = useGitHubData()
	const [fetchCrunchBaseCompany, { loading: crunchBaseLoading, error }] = useCrunchBaseCompany()
	const { searchResults } = useSearchResults(searchValue)

	/**
	 * Fetches GitHub repo data for a company specified by the query string.
	 * In the event of an error, `totalStars` and `repos` are set to `null`.
	 * @param query Query string sent to GitHub API
	 */
	const getGitHubData = async (query: string) => {
		const gitHubData = await fetchGitHubData(query)
		setCompany((prevState) => ({
			...prevState,
			...gitHubData,
		}))
	}

	/**
	 * Fetches information from CrunchBase for a company specified by the query string.
	 * In the event of an error, the company state is set to null.
	 * @param query Query string send to CrunchBase API
	 */
	const getCrunchBaseData = async (query: string) => {
		const crunchBaseCompany = await fetchCrunchBaseCompany(query)
		setCompany((prevState) => ({
			...prevState,
			...crunchBaseCompany,
		}))
	}

	/**
	 * Fetches company data from GitHub and CrunchBase in parallel.
	 * @param query Query string sent to both GitHub and CrunchBase APIs
	 */
	const fetchCompany = (query: string) => {
		setCurrentQuery(query)
		if (!query) setCompany(null)
		getCrunchBaseData(query)
		getGitHubData(query)
	}

	/**
	 * Clears the search term and the company data.
	 */
	const clearSearch = () => {
		setSearchValue('')
		fetchCompany('')
	}

	/**
	 * Render `CompanyCard` with fallback when there is an error or no current search term.
	 */
	const renderCompanyCard = () => {
		if (error || currentQuery === '') {
			const label = error ? error : 'Search for a company to see its GitHub repositories and total stars.'
			return (
				<Card
					full='horizontal'
					padding='medium'
					marginBetween='medium'
				>
					<Flexbox padding='large' >
						<label>{label}</label>
					</Flexbox>
				</Card>
			)
		}
		return (
			<CompanyCard
				company={company}
				companyInfoLoading={crunchBaseLoading}
				reposLoading={gitHubLoading}
			/>
		)
	}

	return (
		<div className='app' >
			<Flexbox
				align='center'
			>
				<Page
					padding='large'
					align='center'
					marginBetween='large'
				>
					<Flexbox
						full='horizontal'
						marginBetween='small'
					>
						<Search
							onEnter={() => fetchCompany(searchValue)}
							onChange={(event) => setSearchValue(event.target.value)}
							placeholder='Search for a company'
							value={searchValue}
							searchResults={searchResults}
							onResultSelect={(value) => fetchCompany(value)}
						/>
						{currentQuery && (
							<Chip marginBetween={6} >
								<label>
									{currentQuery}
								</label>
								<Icon
									icon='times'
									size='1x'
									onClick={clearSearch}
								/>
							</Chip>
						)}
					</Flexbox>
					{renderCompanyCard()}
				</Page>
			</Flexbox>
		</div>
	)
}

export default App
