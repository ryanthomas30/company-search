export interface Company {
	/**
	 * Name of the company.
	 */
	name: string
	/**
	 * City the company is located in.
	 */
	city: string
	/**
	 * Country the company is located in.
	 */
	country: string
	/**
	 * Ticker symbol of the company.
	 */
	stockSymbol: string
	/**
	 * Short description of the company.
	 */
	description: string
	/**
	 * Image URL for the company.
	 */
	imageUrl: string
	/**
	 * Total number of stars a company has on GitHub across repositories.
	 */
	totalStars: number | null
	/**
	 * GitHub repositories owned by the company.
	 */
	repos: Repo[]
}

/**
 * GitHub repository.
 */
export interface Repo {
	/**
	 * Name of the repository.
	 */
	name: string
	/**
	 * Primary language of the repository.
	 */
	language?: string
	/**
	 * Short description of the repository.
	 */
	description: string
	/**
	 * Number of stars the repository has.
	 */
	stars: number
}
