// @ts-check
import { Component } from 'react';
import presenter from './presenter';

export class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      note: '',
    };
    this.changeAmount = this.changeAmount.bind(this);
    this.changeNote = this.changeNote.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.flush();
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state.amount, this.state.note);
    this.flush();
  }

  flush() {
    this.setState({
      amount: '',
      note: '',
    });
  }

  changeAmount(e) {
    this.setState({
      amount: parseFloat(e.target.value),
    });
  }

  changeNote(e) {
    this.setState({
      note: e.target.value,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      changeAmount: this.changeAmount,
      changeNote: this.changeNote,
      onSubmit: this.onSubmit,
    });
  }
}
