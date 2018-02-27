import React from 'react';
import BEMHelper from 'react-bem-helper';
import {
  Tabs as ReactTabs,
  TabList,
  Tab as ReactTab,
  TabPanel,
} from 'react-tabs';

import './Tabs.scss';

function Tabs(props) {
  const classes = new BEMHelper('tabs');

  const {
    onChange,
    sections,
    activeTab,
    setSelectedTab,
  } = props;

  return (
    <ReactTabs
      {...classes()}
      onSelect={(index) => {
        setSelectedTab(index);
        if (onChange) {
          onChange(index);
        }
      }}
    >
      <TabList {...classes('list')}>
        {sections.map((section, key) =>
          <ReactTab
            key={key}
            {...classes({
              element: 'tab',
              modifiers: {
                selected: activeTab === key,
              },
            })}
          >
            <div {...classes('tab-title')}>
              <span {...classes('tab-label')}>
                {section.title}
              </span>
              {section.badge > 0 &&
                <span {...classes('badge')}>
                  {section.badge}
                </span>
              }
            </div>
          </ReactTab>
        )}
      </TabList>
      {sections.map((section, key) =>
        <TabPanel
          key={key}
          {...classes({
            element: 'tab-content',
            modifiers: {
              selected: activeTab === key,
            },
          })}
        >
          {section.content}
        </TabPanel>
      )}
    </ReactTabs>
  );
}

export default Tabs;
