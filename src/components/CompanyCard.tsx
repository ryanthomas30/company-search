import React from 'react'

import styled from 'styled-components'

import { Flexbox, Row, Card, Chip, StarCounter, RepoCard, LoadingBoundary, Loader } from '../components'
import { Company } from '../model'

interface Props {
	/**
	 * Company to render.
	 */
	company: Partial<Company> | null
	/**
	 * Whether the CrunchBase data is loading.
	 */
	companyInfoLoading: boolean
	/**
	 * Whether the GitHub data is loading.
	 */
	reposLoading: boolean
}

/**
 * Component that renders a `Card` for a company.
 */
export const CompanyCard: React.FC<Props> = ({ company, companyInfoLoading, reposLoading }) => (
	<Card
		full='horizontal'
		padding='large'
		marginBetween='medium'
	>
		<LoadingBoundary loading={companyInfoLoading} >
			<Row
				justify='between'
			>
				<Flexbox
					direction='row'
					align='center'
					marginBetween='medium'
				>
					<Image src={company?.imageUrl} />
					<Flexbox>
						<Flexbox
							direction='row'
							align='center'
							marginBetween='small'
						>
							<h1>
								{company?.name}
							</h1>
							{company?.stockSymbol && (
								<Chip>
									{company?.stockSymbol}
								</Chip>
							)}
						</Flexbox>
						<Flexbox
							direction='row'
							align='center'
							marginBetween={6}
						>
							<label>{`${company?.city}${company?.country && ','}`}</label>
							<label>{company?.country}</label>
						</Flexbox>
					</Flexbox>
				</Flexbox>
				<LoadingBoundary
					loading={reposLoading}
					fallBack={(
						<Flexbox>
							<Loader size={30} />
						</Flexbox>
					)}
				>
					<StarCounter stars={company?.totalStars} />
				</LoadingBoundary>
			</Row>
			<Flexbox>
				<p>{company?.description}</p>
			</Flexbox>
		</LoadingBoundary>
		<Flexbox
			marginBetween='medium'
			full='horizontal'
		>
			<LoadingBoundary loading={reposLoading} >
				{company?.repos?.length === 0 && (
					<FadedLabel>This company has no GitHub repositories associated with it.</FadedLabel>
				)}
				{company?.repos && company?.repos.map(repo => (
					<RepoCard
						key={repo.name}
						repo={repo}
					/>
				))}
			</LoadingBoundary>
		</Flexbox>
	</Card>
)

const Image = styled.img`
	object-fit: cover;
	height: 100px;
	width: 100px;
	border-radius: 50%;
`

const FadedLabel = styled.label`
	color: rgba(255, 255, 255, 0.38);
	font-style: italic;
`
