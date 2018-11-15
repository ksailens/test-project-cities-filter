import React, {Component} from 'react';
import './TransferSelector.scss'
import _ from 'lodash'
import PropTypes from 'prop-types';
import update from 'immutability-helper';


const TRANSFERS_ALL_ID = -1; // ключ "ВСЕ" для фильтра пересадок

class NumberOfTransfers extends Component {

	getTransferTitleById(id) { // вывод пунктов фильтра с различными окончаниями
		switch(id) {
			case TRANSFERS_ALL_ID:
				return 'Все';
			case 0:
				return 'Без пересадок';
			case 1:
				return '1 пересадка';
			case 2:
			case 3:
			case 4:
				return `${id} пересадки`;
			default:
				return `${id} пересадок`;
		}
	}

	getTransfersDifference(value) {
		const { transfers } = this.props.filter;

		const filterTransfers = _.clone(transfers); //копия по ссылке
		filterTransfers.push(value);

		return _.difference(this.getUniqueTransfersIds(), filterTransfers) // исключаем из 1го массива значения 2го и возвращаем рез-т
	}

	filterSelect(value) {

		const { filter } = this.props;
		const { transfers } = filter;

		if (transfers.includes(value)) {
			const index = transfers.indexOf(value);
			const indexOfAllKey = transfers.indexOf(TRANSFERS_ALL_ID);
			const $transfersMutate = {};

			if (value !== TRANSFERS_ALL_ID) {
				$transfersMutate.$splice = [
					[index, 1],
					(indexOfAllKey === 0) ? [indexOfAllKey, 1] : []
				]
			} else {
				$transfersMutate.$set = []
			}

			return update(filter, { // используем метод update из immutability-helper, позволяющий обновлять свойства объектов, не затирая значения
				transfers: $transfersMutate
			})

		} else {
			if (value === TRANSFERS_ALL_ID) { // если принятое значение "-1", в массив записываются все поездки + "-1"
				return update(filter, {
					transfers: {
						$set: this.getAllUniqueTransfersIds()
					}
				});
			} else {
				if (_.isEmpty(this.getTransfersDifference(value))) { // отмечает ключ "ВСЕ", если отмечены остальные пункты
					return update(filter, {
						transfers: {
							$set: this.getAllUniqueTransfersIds() }
					});
				} else {
					return update(filter, {
						transfers: {
							$push: [value] } // добавляем в массив transfers новый элемент
					});
				}
			}
		}
	}

	handleFilterChange(e) { // обновляет стейт при событии onChange
		const value = parseInt(e.target.value); //
		console.log('this.filterSelect(value)', this.filterSelect(value)); /*---------------------------------------------------------------------------*/
		this.props.updateState('filter', this.filterSelect(value));
	}

	handleSingleSelect(id) { // обработка нажатия на "только"/ при нажатии в массив устанавливается только то, что нажато
		const { filter } = this.props;
		this.props.updateState('filter',
			update(filter, {
				transfers: {
					$set: [id]
				}
			}));
	}

	renderItem(id, index) { // вывод строчек фильтра
		const { transfers } = this.props.filter;
		return (

			<div key={index} className='toggleItem'>
				<input
					type="checkbox"
					value={id}
					onChange={this.handleFilterChange.bind(this)}
					checked={transfers.includes(id)} // проверяем, отмечен или нет фильтр
					{...{id}} // id = {id}
				/>
				<label htmlFor={id}>{this.getTransferTitleById(id)}</label>
				{TRANSFERS_ALL_ID !== id ? <span onClick={this.handleSingleSelect.bind(this, id)}>ТОЛЬКО</span> : null}
				{/*отрисовываем спан для всех, кроме ключа "ВСЕ"*/}
			</div>
		)
	}

	getUniqueTransfersIds() { // возвращает отсортированный массив уникальных пересадок
		const nonUniqueStops = this.renderStop();
		return _.uniq(nonUniqueStops).sort((a, b) => a - b);
	}

	getAllUniqueTransfersIds() { // возвращает массив пересадок вместе ключом "ВСЕ"
		const uniqueTransfersIds = this.getUniqueTransfersIds();
		uniqueTransfersIds.unshift(TRANSFERS_ALL_ID);

		return uniqueTransfersIds;
	}

	renderUniqueStops() { //вывод элементов уникальных пересадок + ключ "ВСЕ"
		const uniqueStops = this.getAllUniqueTransfersIds();
		return uniqueStops.map((uniqueStop, index) => {
			return this.renderItem(uniqueStop, index)
		});
	}

	renderStops(ticket) { // вывод блока-контента для фильтра
		return (
			<div className={'stops pb-2'}>
				<h2>Количество пересадок</h2>
				<div className='toggleList'>
					{this.renderUniqueStops(ticket)}
				</div>
			</div>
		)
	}

	renderStop() { // возвращает пересадки из массива билетов
		const { tickets } = this.props.data;

		return tickets.map((ticket) => {
			return ticket.stops
		})
	}

	render() { // оболочка для фильтра пересадок
		return (
			<div className={'ToggleStops'}>
				{this.renderStops()}
			</div>
		);
	}

}

NumberOfTransfers.propTypes = { // проверка типов данных
	data: PropTypes.object,
	filter: PropTypes.object,
	updateState: PropTypes.func,
};

export default NumberOfTransfers;