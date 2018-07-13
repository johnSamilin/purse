import React from 'react';
import BEMHelper from 'react-bem-helper';
import './style.scss';
import { EmptyState } from '../../../../components';

export default function MoenyFlow(props) {
  const classes = new BEMHelper('money-flow');
  const {
    dimensions,
    flow,
    setLinksContainer,
    setNodesContainer,
    setLabelsContainer,
  } = props;
  const height = dimensions.height - 100;

  return (
    <div {...classes()}>
      <svg {...classes({
        element: 'chart',
        modifiers: {
          hidden: flow === null,
        },
      })}
      width={dimensions.width}
      height={height}
      viewBox={`0 0 ${dimensions.width} ${height}`}
    >
        <g transform={`translate(0, ${height / 2})`}>
          <defs>
            <marker
              id={'arrow'}
              viewBox={'0 0 10 10'}
              refX={'5'}
              refY={'5'}
              markerWidth={'6'}
              markerHeight={'6'}
              orient={'auto-start-reverse'}
            >
              <path d={'M 0 0 L 10 5 L 0 10 z'} />
            </marker>
          </defs>
          <g ref={setNodesContainer} />
          <g ref={setLinksContainer} />
          <g ref={setLabelsContainer} />
        </g>
      </svg>
      {flow === null &&
        <EmptyState message={'Финансовый поток'} />
      }
    </div>
  );
}
