import React from 'react'

import { Flexbox, Row, Card, StarCounter, Chip } from '../components'
import { Repo } from '../model'

interface Props {
	/**
	 * GitHub repository to render.
	 */
	repo: Repo
}

/**
 * Component that renders a `Card` for a GitHub repository.
 */
export const RepoCard: React.FC<Props> = ({ repo }) => (
	<Card
		full='horizontal'
		padding='medium'
		key={repo.name}
		color='#333'
	>
		<Row
			justify='between'
		>
			<Flexbox
				direction='row'
				align='center'
				marginBetween='small'
			>
				<h2>{repo.name}</h2>
				{repo.language && (
					<Chip color='#252526' >{repo.language}</Chip>
				)}
			</Flexbox>
			<StarCounter stars={repo.stars} />
		</Row>
		<Flexbox>
			<p>{repo.description}</p>
		</Flexbox>
	</Card>
)

