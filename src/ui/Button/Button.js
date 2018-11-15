import React from 'react'
import './Button.scss'

const Button = props => { // оболочка дял кнопки

	return (
		<button
			onClick={props.onClick}
			className='Button'
		>
			{props.children}
		</button>
	)
};

export default Button