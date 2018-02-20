import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Summary from './presenter';

function getBalance(total, my, count) {
  if (count === 0) {
    return 0;
  }
  return my - total / count;
}

const mapDispatchToProps = {

};

const mapStateToProps = (state, ownProps) => {
  let total = 0;
  let myTotal = 0;
  const {
    transactions = [],
    users = {},
    currentUserId,
  } = ownProps;
  const activeUsers = Object.values(users).filter(user => user.status === 'active');
  transactions.forEach((t) => {
    total += !t.cancelled ? t.amount : 0;
  });
  transactions.forEach((t) => {
    myTotal += t.ownerId === currentUserId && !t.cancelled ? t.amount : 0;
  });
  myTotal = getBalance(total, myTotal, activeUsers.length);

  return {
    total,
    myTotal,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Summary));
