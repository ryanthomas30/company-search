import axios, { AxiosInstance } from 'axios'

export interface CrunchBaseCompany {
	name: string
	city_name?: string
	country_code?: string
	stock_symbol?: string
	short_description: string
	profile_image_url: string
}

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

	async getCompany(query: string): Promise<CrunchBaseCompany[]> {
		const endpoint = '/odm-organizations'
		const response = await this.axios.get(endpoint, {
			params: {
				name: query,
			},
		})
		return response?.data?.data?.items?.map(({ properties }: { properties: CrunchBaseCompany }) => properties)
	}

	async getFullCompany(query: string): Promise<CrunchBaseCompany> {
		const companies = await this.getCompany(query)
		const [firstResult] = companies
		if (firstResult) return firstResult
		throw Error(`No companies matching the query: "${query}".`)
	}

	async getPartialCompany(query: string): Promise<Pick<CrunchBaseCompany, 'name' | 'profile_image_url'>[]> {
		const companies = await this.getCompany(query)
		return companies.slice(0, 5)
	}
}
