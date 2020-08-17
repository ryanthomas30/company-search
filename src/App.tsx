import React, { useState, useEffect } from 'react'

import { useDebouncedCallback } from 'use-debounce'

import { CrunchBaseAPI, GitHubAPI } from './api'
import { Flexbox, Card, CompanyCard, Page, Search, SearchResult, Chip, Icon } from './components'
import { Company, Repo } from './model'

const App = () => {
	/* STATE */
	const [searchValue, setSearchValue] = useState<string>('')
	const [searchResults, setSearchResults] = useState<SearchResult[]>([])
	const [currentQuery, setCurrentQuery] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [crunchBaseLoading, setCrunchBaseLoading] = useState<boolean>(false)
	const [gitHubLoading, setGitHubLoading] = useState<boolean>(false)
	const [company, setCompany] = useState<Partial<Company> | null>(null)

	/* Debounced call to CrunchBase API that fetches the top 5 most relevant companies based on the query string. */
	const [debouncedGetSearchResults] = useDebouncedCallback(async (searchValue: string) => {
		if (searchValue === '') {
			setSearchResults([])
			return
		}
		const cb = new CrunchBaseAPI()
		const companies = await cb.getPartialCompanies(searchValue)
		const newSearchResults: SearchResult[] = companies.map(company => ({
			title: company.name,
			value: company.name,
			image: company.profile_image_url,
		}))
		setSearchResults([...newSearchResults])
	}, 500)

	useEffect(() => {
		debouncedGetSearchResults(searchValue)
	}, [searchValue, debouncedGetSearchResults])

	/**
	 * Fetches GitHub repo data for a company specified by the query string.
	 * In the event of an error, `totalStars` and `repos` are set to `null`.
	 * @param query Query string sent to GitHub API
	 */
	const getGitHubData = async (query: string) => {
		try {
			setGitHubLoading(true)
			const gh = new GitHubAPI()
			const orgRepos = await gh.getOrganizationRepos(query)
			const totalStars = orgRepos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
			const repos: Repo[] = orgRepos.slice(0, 10).map((repo) => ({
				name: repo.name,
				language: repo.language,
				description: repo.description,
				stars: repo.stargazers_count,
			}))

			const company: Partial<Company> = {
				totalStars,
				repos,
			}
			setCompany((prevState) => ({
				...prevState,
				...company,
			}))
		} catch (err) {
			const company: Partial<Company> = {
				totalStars: null,
				repos: [],
			}
			setCompany((prevState) => ({
				...prevState,
				...company,
			}))
		} finally {
			setGitHubLoading(false)
		}
	}

	/**
	 * Fetches information from CrunchBase for a company specified by the query string.
	 * In the event of an error, the company state is set to null.
	 * @param query Query string send to CrunchBase API
	 */
	const getCrunchBaseData = async (query: string) => {
		try {
			setCrunchBaseLoading(true)
			const cb = new CrunchBaseAPI()
			const companyInfo = await cb.getCompany(query)
			const company: Partial<Company> = {
				name: companyInfo.name,
				city: companyInfo.city_name,
				country: companyInfo.country_code,
				stockSymbol: companyInfo.stock_symbol,
				description: companyInfo.short_description,
				imageUrl: companyInfo.profile_image_url,
			}
			setCompany((prevState) => ({
				...prevState,
				...company,
			}))
			setError('')
		} catch (err) {
			setError(err.message)
			setCompany(null)
		} finally {
			setCrunchBaseLoading(false)
		}
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
