import React from 'react';
import BEMHelper from 'react-bem-helper';
import numeral from 'numeral';
import {
    EmptyState,
    UserInfo,
    Button,
    Header,
} from 'components';
import { statusesMap } from 'routes/Budget/const';
import { paths } from 'routes/Collaborators/const';
import { get } from 'lodash';
import './style.scss';

export default function Collaborators(props) {
    const classes = new BEMHelper('collaborators');
    let pageClasses = new BEMHelper('page');
    pageClasses = pageClasses({ modifiers: { next: props.isNext, active: props.isActive } }).className;
    const {
        id,
        users,
        changeUserStatus,
        budget,
        canManage = false,
        title,
        ownerId,
    } = props;
    const backurl = paths.budget(id);

    return (
        <div {...classes({ extra: pageClasses })}>
            <Header title={title} backurl={backurl} />
			{users && users.map(user =>
				<div {...classes('user')}>
					<UserInfo {...user} />
					<div {...classes('actions')}>
						<span {...classes('status', user.status)}>
							{user.id == ownerId ? 'Owner' : user.status}
						</span>
						{canManage && user.id !== ownerId
							? <Button
								{...classes('action')}
								mods={['inline', get(statusesMap, `[${user.status}].modifier`, 'active')]}
								onClick={() => changeUserStatus(user, get(statusesMap, `[${user.status}].nextStatus`, 'pending'))}
							>
								{get(statusesMap, `[${user.status}].title`)}
							</Button>
							: null
						}
					</div>
				</div>
			)}
			{!users || !users.length
				? <EmptyState message={'Участники'} />
				: null
			}
		</div>
    );
}