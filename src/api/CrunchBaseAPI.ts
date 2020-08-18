import { useState, useEffect } from 'react'
import axios, { AxiosInstance } from 'axios'
import { useDebouncedCallback } from 'use-debounce'

import { Company, SearchResult } from '../model'

export interface CrunchBaseCompanyResponse {
	data: {
		items?: [{
			properties: CrunchBaseCompany
		}]
	}
}

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
		const response = await this.axios.get<CrunchBaseCompanyResponse>(endpoint, {
			params: {
				name: query,
			},
		})
		return response.data.data.items?.map(({ properties }) => properties) ?? []
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

/* HOOKS */

export type CrunchBaseCompanyHook = [
	(query: string) => Promise<Partial<Company>| null>,
	{
		loading: boolean
		error: string
	}
]

/**
 * Returns a function that fetches information from CrunchBase for a company specified by the query string.
 * In the event of an error, the company is returned as null.
 * * Also returns a loading state for the function.
 * @param query Query string send to CrunchBase API
 */
export const useCrunchBaseCompany = (): CrunchBaseCompanyHook => {
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const fetchCrunchBaseCompany = async (query: string): Promise<Partial<Company> | null> => {
		try {
			setLoading(true)
			const cb = new CrunchBaseAPI()
			const companyInfo = await cb.getCompany(query)
			setError('')
			return {
				name: companyInfo.name,
				city: companyInfo.city_name,
				country: companyInfo.country_code,
				stockSymbol: companyInfo.stock_symbol,
				description: companyInfo.short_description,
				imageUrl: companyInfo.profile_image_url,
			}
		} catch (err) {
			setError(err.message)
			return null
		} finally {
			setLoading(false)
		}
	}
	return [
		fetchCrunchBaseCompany,
		{
			loading,
			error,
		},
	]
}

export interface SearchResultsHook {
	searchResults: SearchResult[]
	loading: boolean
}

/**
 * Hook that returns the search results from CrunchBase given a search value.
 * Also returns the loading state of the API call being run.
 * @param searchValue
 */
export const useSearchResults = (searchValue: string): SearchResultsHook => {
	const [searchResults, setSearchResults] = useState<SearchResult[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const fetchCrunchBaseCompanies = async () => {
		if (searchValue === '') {
			setSearchResults([])
			return
		}
		setLoading(true)
		const cb = new CrunchBaseAPI()
		const companies = await cb.getPartialCompanies(searchValue)
		const newSearchResults: SearchResult[] = companies.map(company => ({
			title: company.name,
			value: company.name,
			image: company.profile_image_url,
		}))
		setLoading(false)
		setSearchResults([...newSearchResults])
	}

	const [debouncedGetSearchResults] = useDebouncedCallback(fetchCrunchBaseCompanies, 500)

	useEffect(() => {
		debouncedGetSearchResults()
	}, [searchValue, debouncedGetSearchResults])

	return {
		searchResults,
		loading,
	}
}
