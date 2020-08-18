import { useState } from 'react'
import GitHub from 'github-api'

import { Repo, Company } from '../model'

/**
 * Client to interface with the GitHub API.
 */
export class GitHubAPI {
	private readonly GitHub: GitHub
	constructor() {
		this.GitHub = new GitHub()
	}

	/**
	 * Gets a single GitHub organization by name.
	 * @param orgName Name of the company to search for.
	 */
	getOrganization(orgName: string) {
		return this.GitHub.getOrganization(orgName)
	}

	/**
	 * Gets the repositories for a GitHub organization by its name.
	 * @param orgName Name of the company to search for.
	 */
	async getOrganizationRepos(orgName: string) {
		const organization = await this.getOrganization(orgName)
		const response = await organization.getRepos()
		return response.data
	}
}

/* HOOKS */

export type GitHubDataHook = [
	(query: string) => Promise<Partial<Company>>,
	{
		loading: boolean
	}
]

/**
 * Returns a function that fetches GitHub repo data for a company specified by the query string.
 * In the event of an error, `totalStars` and `repos` are returned as `null` and `[]` respectively.
 * Also returns a loading state for the function.
 * @param query Query string sent to GitHub API
 */
export const useGitHubData = (): GitHubDataHook => {
	const [loading, setLoading] = useState<boolean>(false)
	const fetchGitHubData = async (query: string): Promise<Partial<Company>> => {
		try {
			setLoading(true)
			const gh = new GitHubAPI()
			const orgRepos = await gh.getOrganizationRepos(query)
			const totalStars = orgRepos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
			const repos: Repo[] = orgRepos.slice(0, 10).map((repo) => ({
				name: repo.name,
				language: repo.language,
				description: repo.description,
				stars: repo.stargazers_count,
			}))
			return {
				totalStars,
				repos,
			}
		} catch (err) {
			return {
				totalStars: null,
				repos: [],
			}
		} finally {
			setLoading(false)
		}
	}
	return [
		fetchGitHubData,
		{
			loading,
		},
	]
}
