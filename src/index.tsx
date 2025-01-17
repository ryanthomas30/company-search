/* React */
import React from 'react'
import ReactDOM from 'react-dom'

/* Root Component */
import App from './App'

/* Icons */
import { library } from '@fortawesome/fontawesome-svg-core'
import { icons } from './constants'

/* Stylesheet */
import './styles/index.scss'

import * as serviceWorker from './serviceWorker'

library.add(...icons)

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
