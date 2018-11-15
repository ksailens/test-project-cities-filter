import React, {Component} from 'react';
import './CitiesSelector.scss'
import _ from 'lodash'
import PropTypes from 'prop-types';
import update from 'immutability-helper';


const CITIES_ALL_ID = 'Все'; // ключ "ВСЕ" для фильтра пересадок

class CitiesSelector extends Component {

	// randomFucking() { // а так нифига не получается
	// 	const allCitiesForRender = this.getAllUniqueCitiesIds();
	// 	return allCitiesForRender.forEach(item => item);
	// }

  getCityTitleById(id) { // так города фиксированы и вместо Каира метод выведет Пусто
    switch(id) {
      case CITIES_ALL_ID:
        return 'Все';
      case 'Калининград':
        return `${id}`;
      case 'Тель-Авив':
        return `${id}`;
      case 'Москва':
        return `${id}`;
      case 'Симферополь':
        return `${id}`;
      default:
        return 'Пусто';
    }
  }

  getCitiesDifference(value) {
    const { cities } = this.props.filter;

    const filterCities = _.clone(cities); //копия по ссылке
    filterCities.push(value);

    return _.difference(this.getUniqueCitiesIds(), filterCities) // исключаем из 1го массива значения 2го и возвращаем рез-т
  }

  filterSelect(value) {
    const { filter } = this.props;
    const { cities } = filter;

    if (cities.includes(value)) {
      const index = cities.indexOf(value);
      const indexOfAllKey = cities.indexOf(CITIES_ALL_ID);
      const $citiesMutate = {};

      if (value !== CITIES_ALL_ID) {
        $citiesMutate.$splice = [
          [index, 1],
          (indexOfAllKey === 0) ? [indexOfAllKey, 1] : []
        ]
      } else {
        $citiesMutate.$set = []
      }

      return update(filter, { // используем метод update из immutability-helper, позволяющий обновлять свойства объектов, не затирая значения
        cities: $citiesMutate
      })

    } else {
      if (value === CITIES_ALL_ID) { // если принятое значение "-1", в массив записываются все поездки + "-1"
        return update(filter, {
          cities: {
            $set: this.getAllUniqueCitiesIds()
          }
        });
      } else {
        if (_.isEmpty(this.getCitiesDifference(value))) { // отмечает ключ "ВСЕ", если отмечены остальные пункты
          return update(filter, {
            cities: {
              $set: this.getAllUniqueCitiesIds() }
          });
        } else {
          return update(filter, {
            cities: {
              $push: [value] } // добавляем в массив transfers новый элемент
          });
        }
      }
    }
  }

  handleFilterChange(e) { // обновляет стейт при событии onChange
    const value = e.target.value; //
    console.log(value);
    this.props.updateState('filter', this.filterSelect(value));
  }

  handleSingleSelect(id) { // обработка нажатия на "только"/ при нажатии в массив устанавливается только то, что нажато
    const { filter } = this.props;
    this.props.updateState('filter',
      update(filter, {
        cities: {
          $set: [id]
        }
      }));
  }

  renderCityItem(id, index) { // вывод строчек фильтра
    const { cities } = this.props.filter;
    return (

      <div key={index} className='toggleItem'>
        <input
          type="checkbox"
          value={id}
          onChange={this.handleFilterChange.bind(this)}
          checked={cities.includes(id)} // проверяем, отмечен или нет фильтр
          {...{id}} // id = {id}
        />
        <label htmlFor={id}>{this.getCityTitleById(id)}</label>
        {CITIES_ALL_ID !== id ? <span onClick={this.handleSingleSelect.bind(this, id)}>ТОЛЬКО</span> : null}
        {/*отрисовываем спан для всех, кроме ключа "ВСЕ"*/}
      </div>
    )
  }

  getUniqueCitiesIds() { // возвращает отсортированный массив уникальных пересадок
    const nonUniqueCities = this.renderCity();
    return _.uniq(nonUniqueCities).sort();
  }

  getAllUniqueCitiesIds() { // возвращает массив пересадок вместе ключом "ВСЕ"
    const uniqueCitiesIds = this.getUniqueCitiesIds();
    uniqueCitiesIds.unshift(CITIES_ALL_ID);

    return uniqueCitiesIds;
  }

  renderUniqueCities() { //вывод элементов уникальных пересадок + ключ "ВСЕ"
    const uniqueCities = this.getAllUniqueCitiesIds();
    return uniqueCities.map((uniqueCity, index) => {
      return this.renderCityItem(uniqueCity, index)
    });
  }

  renderCities(ticket) { // вывод блока-контента для фильтра
    return (
      <div className={'stops pb-2'}>
        <h2>Выбор города</h2>
        <div className='toggleList'>
          {this.renderUniqueCities(ticket)}
        </div>
      </div>
    )
  }

  renderCity() { // возвращает пересадки из массива билетов
    const { tickets } = this.props.data;

    return tickets.map((ticket) => {
      return ticket.destination_name
    })
  }

  render() { // оболочка для фильтра пересадок
    return (
      <div className={'ToggleStops mt-3'}>
        {this.renderCities()}
      </div>
    );
  }

}

CitiesSelector.propTypes = { // проверка типов данных
  data: PropTypes.object,
  filter: PropTypes.object,
  updateState: PropTypes.func,
};

export default CitiesSelector;