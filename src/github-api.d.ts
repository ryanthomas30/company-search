declare module 'github-api' {
	export default class {
		getOrganization(organizationName: string): Promise<Organization>
	}

	export interface Organization {
		getRepos: () => Promise<{ data: GitHubRepo[] }>
	}

	export interface GitHubRepo {
		name: string
		language?: string
		description: string
		stargazers_count: number
	}

}
