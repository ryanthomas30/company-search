import GitHub from 'github-api'

export class GitHubAPI {
	private readonly GitHub: GitHub
	constructor() {
		this.GitHub = new GitHub()
	}

	getOrganization(orgName: string) {
		return this.GitHub.getOrganization(orgName)
	}

	async getOrganizationRepos(orgName: string) {
		const organization = await this.getOrganization(orgName)
		const response = await organization.getRepos()
		return response.data
	}
}
