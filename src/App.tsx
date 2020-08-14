import React, { useState } from 'react'

import GitHub from 'github-api'
import { duckIt } from 'node-duckduckgo'

import { Flexbox, Page, Card, Search } from './components'
import { Company, Member } from './model'

const App = () => {
	const [searchValue, setSearchValue] = useState<string>('')
	const [currentQuery, setCurrentQuery] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [company, setCompany] = useState<Company | null>(null)

	const fetchCompany = async (query: string) => {
		const gh = new GitHub()
		try {
			/* GitHub */
			const gitHubOrg = await gh.getOrganization(query)
			const gitHubOrgMembers = await gitHubOrg.listMembers()
			/* DuckDuckGo */
			const result = await duckIt(`${query}`, {
				appName: 'companySearchApp',
				noRedirect: true,
				skipDisambig: true,
			})
			console.log('gitHubOrgMembers:', gitHubOrgMembers)
			console.log('result.data:', result.data)
			const members: Member[] = gitHubOrgMembers.data.map((member: any) => ({
				name: member.login,
				avatarUrl: member.avatar_url,
			}))
			const company: Company = {
				description: result.data.AbstractText,
				imageUrl: result.data.Image,
				members,
			}

			setCompany(company)

		} catch (err) {
			console.log(err)
		}
	}

	const handleEnterPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setCurrentQuery(searchValue)
			fetchCompany(searchValue)
		}
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
					<Search
						onKeyDown={handleEnterPressed}
						onChange={(event) => setSearchValue(event.target.value)}
						placeholder='Search for a company'
					/>
					{currentQuery}
					<Card
						full='horizontal'
						padding='large'
					>
						{JSON.stringify(company)}
					</Card>
				</Page>
			</Flexbox>
		</div>
	)
}

export default App
