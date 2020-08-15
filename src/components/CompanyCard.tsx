import React from 'react'

import styled from 'styled-components'

import { Flexbox, Row, Card, Icon, Chip } from '../components'
import { Company } from '../model'

interface Props {
	company: Partial<Company> | null
}

export const CompanyCard: React.FC<Props> = ({ company }) => (
	<Card
		full='horizontal'
		padding='medium'
		marginBetween='medium'
	>
		{!company && (
			<Flexbox padding='large' >
				<label>Search for a company</label>
			</Flexbox>
		)}
		{company && (
			<>
				<Row
					justify='between'
				>
					<Flexbox
						direction='row'
						align='center'
						marginBetween='medium'
					>
						<Image src={company.imageUrl} />
						<Flexbox>
							<Flexbox
								direction='row'
								align='center'
								marginBetween='small'
							>
								<h1>
									{company.name}
								</h1>
								{company.stockSymbol && (
									<Chip>
										{company.stockSymbol}
									</Chip>
								)}
							</Flexbox>
							<Flexbox>
								<label>{`${company.city}, ${company.country}`}</label>
							</Flexbox>
						</Flexbox>
					</Flexbox>
					{company.totalStars && (
						<Flexbox
							direction='row'
							align='center'
							marginBetween='small'
						>
							<Icon
								icon='star'
								size='lg'
							/>
							<h4>{company.totalStars}</h4>
						</Flexbox>
					)}
				</Row>
				<Flexbox
					paddingHorizontal='medium'
				>
					<p>{company.description}</p>
				</Flexbox>
				<Flexbox
					marginBetween='medium'
					paddingHorizontal='medium'
					full='horizontal'
				>
					{company?.repos?.length === 0 && (
						<label><i>This company has no repos associated with it.</i></label>
					)}
					{company.repos && company.repos.map(repo => (
						<Card
							full='horizontal'
							padding='medium'
							key={repo.name}
							color='#333'
						>
							<Row
								justify='between'
							>
								<Flexbox>
									<h2>{repo.name}</h2>
									<label>{repo.language}</label>
								</Flexbox>
								<Flexbox
									direction='row'
									align='center'
									marginBetween='small'
								>
									<Icon
										icon='star'
										size='lg'
									/>
									<h4>{repo.stars}</h4>
								</Flexbox>
							</Row>
							<Flexbox>
								<p>{repo.description}</p>
							</Flexbox>
						</Card>
					))}
				</Flexbox>
			</>
		)}
	</Card>
)

const Image = styled.img`
	object-fit: cover;
	height: 100px;
	width: 100px;
	border-radius: 50%;
`
