import React, { Component } from 'react';
import logo from './images/logo.png';
import './App.scss';
import Filter from './components/FilterOfTransfers/Filter'
import BuyTickets from './components/BuyTickets/BuyTickets';
import load from './loadJSON/load'
import _ from 'lodash';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: null, // для данных из json
			filter: { // для добавления других вариантов сортировок
				transfers: [],	//массив для накопления "нажатых" значений
				cities: []
			},
		};

		this.loadData('database.json');
	}

	loadData(url) {// загрузка в state данных из json
		load(url).then((data) => {
			this.setState({
				data: JSON.parse(data)
			});
		});
	}

	updateData(fieldName, value) { // обновление данных в стейте
		this.setState({
			[fieldName]: value,
		});
	}

	getFilteredTickets(tickets) {
		const { transfers } = this.state.filter;
		if (_.isEmpty(transfers)) { // вернуть полный список билетов, если ни один элемент фильтра не отмечен
			return tickets;
		}
		return tickets.filter(ticket => transfers.includes(ticket.stops)); // отобразить билеты в соотвествии с фильтром
	}

  getFilteredCities(tickets) {
    const { cities } = this.state.filter;
    if (_.isEmpty(cities)) { // вернуть полный список билетов, если ни один элемент фильтра не отмечен
      return tickets;
    }
    return tickets.filter(ticket => cities.includes(ticket.destination_name)); // отобразить билеты в соотвествии с фильтром
  }

	renderHeader() { // оболочка для хедера
		return (
			<header className='pt-5 mb-5 text-center'>
				<img className='mainLogo' src={logo} alt="logo" />
			</header>
		)
	}

	renderContent() { // оболочка для контента
		const { data } = this.state;
		if (!data) { // исключение ошибки, если нет данных
			return;
		}

		return (
			<section className='row'>
				<Filter
					updateState={this.updateData.bind(this)}
					{...this.state}
				/>
				<BuyTickets
					tickets={this.getFilteredTickets(data.tickets)}
				/>
			</section>
		);
	}

	render() {
		return (
			<div className='App container'>
				{ this.renderHeader() }
				{ this.renderContent() }
			</div>
		);
	}

}

export default App;