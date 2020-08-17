import axios, { AxiosInstance } from 'axios'

export interface CrunchBaseCompany {
	name: string
	city_name?: string
	country_code?: string
	stock_symbol?: string
	short_description: string
	profile_image_url: string
}

/**
 * Client to interface with the CrunchBase API.
 */
export class CrunchBaseAPI {

	private readonly BASE_URL?: string
	private readonly API_KEY?: string
	private readonly axios: AxiosInstance

	constructor() {
		this.BASE_URL = process.env.REACT_APP_CRUNCHBASE_BASE_URL
		this.API_KEY = process.env.REACT_APP_RAPID_API_KEY

		this.axios = axios.create({
			baseURL: this.BASE_URL,
			headers: {
				'X-RapidAPI-Key': this.API_KEY,
			},
		})
	}

	/**
	 * Get a list of companies matching a query string.
	 * @param query Query string used to search for companies.
	 */
	async getCompanies(query: string): Promise<CrunchBaseCompany[]> {
		const endpoint = '/odm-organizations'
		const response = await this.axios.get(endpoint, {
			params: {
				name: query,
			},
		})
		return response?.data?.data?.items?.map(({ properties }: { properties: CrunchBaseCompany }) => properties)
	}

	/**
	 * Gets the first result in a list of companies matching a query string.
	 * @param query Query string used to search for a company.
	 */
	async getCompany(query: string): Promise<CrunchBaseCompany> {
		const companies = await this.getCompanies(query)
		const [firstResult] = companies
		if (firstResult) return firstResult
		throw Error(`No companies matching the query: "${query}".`)
	}

	/**
	 * Gets the first 5 results in a list of companies matching a query string.
	 * Only returns the `name` and `profile_image_url` for each company.
	 * @param query Query string used to search for companies.
	 */
	async getPartialCompanies(query: string): Promise<Pick<CrunchBaseCompany, 'name' | 'profile_image_url'>[]> {
		const companies = await this.getCompanies(query)
		return companies.slice(0, 5)
	}
}
