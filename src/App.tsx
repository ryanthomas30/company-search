import React, { useState, useEffect } from 'react'

import { useDebouncedCallback } from 'use-debounce'

import { CrunchBaseAPI, GitHubAPI } from './api'
import { Flexbox, Card, CompanyCard, Page, Search, SearchResult, Chip, Icon } from './components'
import { Company, Repo } from './model'

const App = () => {
	const [searchValue, setSearchValue] = useState<string>('')
	const [searchResults, setSearchResults] = useState<SearchResult[]>([])
	const [currentQuery, setCurrentQuery] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [crunchBaseLoading, setCrunchBaseLoading] = useState<boolean>(false)
	const [gitHubLoading, setGitHubLoading] = useState<boolean>(false)
	const [company, setCompany] = useState<Partial<Company> | null>(null)

	const [debouncedGetSearchResults] = useDebouncedCallback(async (searchValue: string) => {
		if (searchValue === '') {
			setSearchResults([])
			return
		}
		const cb = new CrunchBaseAPI()
		const companies = await cb.getPartialCompany(searchValue)
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

	const getCrunchBaseData = async (query: string) => {
		try {
			setCrunchBaseLoading(true)
			const cb = new CrunchBaseAPI()
			const companyInfo = await cb.getFullCompany(query)
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

	const fetchCompany = async (query: string) => {
		setCurrentQuery(query)
		if (!query) setCompany(null)
		getCrunchBaseData(query)
		getGitHubData(query)
	}

	const handleEnterPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			fetchCompany(searchValue)
		}
	}

	const clearSearch = () => {
		setSearchValue('')
		fetchCompany('')
	}

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
							onKeyDown={handleEnterPressed}
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
