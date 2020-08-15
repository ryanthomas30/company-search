import React, { useState } from 'react'

import { CrunchBaseAPI, GitHubAPI } from './api'
import { Flexbox, Card, CompanyCard, Page, Search, Chip } from './components'
import { Company } from './model'

const App = () => {
	const [searchValue, setSearchValue] = useState<string>('')
	const [currentQuery, setCurrentQuery] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [crunchBaseLoading, setCrunchBaseLoading] = useState<boolean>(false)
	const [gitHubLoading, setGitHubLoading] = useState<boolean>(false)
	const [company, setCompany] = useState<Partial<Company> | null>(null)

	const getGitHubData = async (query: string) => {
		try {
			setGitHubLoading(true)
			const gh = new GitHubAPI()
			const orgRepos = await gh.getOrganizationRepos(query)
			const totalStars = orgRepos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
			const repos = orgRepos.slice(0, 10).map((repo: any) => ({
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

	const fetchCompany = async (query: string) => {
		if (!query) setCompany(null)
		getCrunchBaseData(query)
		getGitHubData(query)
	}

	const handleEnterPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setCurrentQuery(searchValue)
			fetchCompany(searchValue)
		}
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
						/>
						{currentQuery && (
							<Chip>
								{currentQuery}
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
