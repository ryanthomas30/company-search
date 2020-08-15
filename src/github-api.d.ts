declare module 'github-api' {
	export default class {
		getOrganization(organizationName: string): Organization
	}

	export interface Organization {
		getRepos: () => { data: GitHubRepo[] }
	}

	export interface GitHubRepo {
		name: string
		language?: string
		description: string
		stargazers_count: number
	}

}
