import React from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import moment from 'moment';
import { paths } from '../../const';

require('./style.scss');

function Info(props) {
	const {
		id,
		date,
		title,
		isActive,
		state,
	} = props;
	const classes = new BEMHelper('budget-list-item');
	const isClosed = state === 'closed';

	return (
		<li {...classes({ modifiers: { active: isActive } })}>
			<div {...classes({ element: 'badge', modifiers: { green: true, closed: isClosed } })}>
				<i {...classes({
					element: 'badge-text',
					extra: isClosed ? 'mi mi-lock-outline' : '',
				})}>
					{!isClosed &&
						'+1'
					}
				</i>
			</div>
			<Link to={paths.budget(id)} {...classes('wrapper')}>
				<span {...classes('date')}>{moment(date).format('DD.MM.Y')}</span>
				<span {...classes('title')}>{title}</span>
			</Link>
		</li>
	);
}

export default Info;
