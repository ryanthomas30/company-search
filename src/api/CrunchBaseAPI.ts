import axios, { AxiosInstance } from 'axios'

export class CrunchBaseAPI {

	private readonly BASE_URL: string
	private readonly API_KEY?: string
	private readonly axios: AxiosInstance

	constructor() {
		this.BASE_URL = 'https://crunchbase-crunchbase-v1.p.rapidapi.com'
		this.API_KEY = process.env.REACT_APP_RAPID_API_KEY

		this.axios = axios.create({
			baseURL: this.BASE_URL,
			headers: {
				'X-RapidAPI-Key': this.API_KEY,
			},
		})
	}

	async getCompany(query: string) {
		const endpoint = '/odm-organizations'
		const response = await this.axios.get(endpoint, {
			params: {
				name: query,
			},
		})
		return response?.data?.data?.items[0].properties
	}
}
