// @ts-check
import presenter from '../components';
import { Page } from '../../../providers/Page';
import { path } from '../const';/*
import { GlobalStore } from '../../../store/globalStore';
import { budgetStates } from '../../../const';
import get from 'lodash/get';*/

export class Settings extends Page {
  constructor(params) {
    super(params);
    this.path = path;
    this.state = {
      ...super.state,
      dimensions: {
        width: 300,
        height: 600,
      },
      isEstimated: false,
    };

    this.estimateDimensions = this.estimateDimensions.bind(this);
  }

  estimateDimensions(element) {
    if (element && !this.state.isEstimated) {
      const dimensions = element.getBoundingClientRect();
      this.setState({
        dimensions,
        isEstimated: true,
      });
    }
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      getPageClasses: this.getPageClasses,
      estimateDimensions: this.estimateDimensions,
    });
  }
}
