// @ts-check
import React from 'react';
import BEMHelper from 'react-bem-helper';
import {
  Header,
} from '../../../components';
import { paths } from '../const';
import { GlobalStore } from '../../../store/globalStore';
import { Tabs } from '../../../components/Tabs';
import { Collaborators } from './Collaborators';
import { MoneyFlow } from './MoneyFlow';
import './style.scss';

export default function Settings(props) {
  const classes = new BEMHelper('budget-settings');
  
  const {
    getPageClasses,
    estimateDimensions,
    dimensions,
  } = props;
  const activeBudget = GlobalStore.modules.budgets.activeBudget.value || {};
  const backurl = paths.budget(activeBudget.id);

  const sections = [
    {
      title: 'Участники',
      content: (<Collaborators />),
    },
    {
      title: 'Финансовый поток',
      content: (<MoneyFlow dimensions={dimensions} />),
    },
  ];

  return (
    <div {...classes({ extra: getPageClasses() })} ref={estimateDimensions}>
      <Header title={'Настройки'} backurl={backurl} />
      <Tabs sections={sections} />
    </div>
  );
}
