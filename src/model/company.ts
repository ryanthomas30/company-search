export interface Company {
	name: string //
	city: string //
	country: string //
	stockSymbol: string //
	description: string
	imageUrl: string //
	totalStars: number | null
	repos: Repo[]
}

export interface Repo {
	name: string
	language: string
	description: string
	stars: number
}
