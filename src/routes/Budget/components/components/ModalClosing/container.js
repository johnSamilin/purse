import { connect } from 'react-redux';
import { Component } from 'react';
import { decisions } from 'routes/Budget/const';
import { budgetStates } from 'const';
import select from 'routes/Budget/modules/selectors';
import { Database } from 'database';
import presenter from './presenter';

@connect(mapStateToProps)
class ModalClosing extends Component {
  componentWillMount() {
    const budgetsQuery = Database.instance.budgets.findOne(this.props.id);
    this.budgetDocument = budgetsQuery
      .exec()
      .then(budget => this.budgetDocument = budget);
    this.makeDecision = this.makeDecision.bind(this);
  }

  updateDecision(decision, user) {
    return {
      ...user,
      decision: user.id === this.props.currentUserId ? decision : user.decision,
    }
  }

  makeDecision(decision) {
    // поменять в модели
    this.budgetDocument.users = this.budgetDocument.users.map(this.updateDecision.bind(this, decision));
    // поменять локально чтобы посмотреть какой ставить статус бюджету
    const userList = this.props.usersList
      .filter(user => !user.isOwner)
      .map(this.updateDecision.bind(this, decision));
    const isRejected = userList.find(user => user.decision === decisions.rejected);
    const isApproved = userList.find(user => user.decision !== decisions.approved) === undefined;
    if (isRejected) {
      // TODO: в бэк отправить
      this.budgetDocument.state = budgetStates.opened;
    } else if (isApproved) {
      this.budgetDocument.state = budgetStates.closed;
    }

    this.budgetDocument.save();
  }

  render() {
    return presenter({
      ...this.props,
      makeDecision: this.makeDecision,
    });
  }
}

function mapStateToProps(state, ownProps) {
  const budget = select.budget(state);

  return {
    id: budget.id,
    usersList: Object.values(ownProps.usersList),
  };
}

export default ModalClosing;
