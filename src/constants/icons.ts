import { IconDefinition, IconPack } from '@fortawesome/fontawesome-svg-core'
import {
	faSearch,
	faStar,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'

type IconDefinitionOrPack = IconDefinition | IconPack

export const icons: Array<IconDefinitionOrPack> = [
	faSearch,
	faStar,
	faTimes,
]
