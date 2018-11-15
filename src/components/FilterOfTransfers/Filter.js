import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TransferSelector from './TransferSelector/TransferSelector';
import CitiesSelector from './CitiesSelector/CitiesSelector';
import './Filter.scss'

class Filter extends Component { // оболочка для фильтра билетов
	render() {
		return (
			<div className={'Filter col-sm-4 col-md-12 col-lg-4 mb-4'}>
				<TransferSelector
					{ ...this.props }
				/>
				<CitiesSelector
          { ...this.props }
				/>
			</div>
		)
	}
}

Filter.propTypes = { // проверка типов данных
	data: PropTypes.object,
	filter: PropTypes.object,
	updateState: PropTypes.func,
};

export default Filter;