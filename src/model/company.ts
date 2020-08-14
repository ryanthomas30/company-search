export interface Company {
	name: string
	description: string
	imageUrl: string
	members: Member[]
}

export interface Member {
	name: string
	avatarUrl?: string
}
