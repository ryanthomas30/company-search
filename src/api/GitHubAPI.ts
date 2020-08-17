import GitHub from 'github-api'

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
