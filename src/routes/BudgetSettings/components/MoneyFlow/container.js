import { Component } from 'react';
import presenter from './presenter';
import { GlobalStore } from '../../../../store/globalStore';
import { budgetsActions } from '../../../../modules/budgets/actions';
import { Database } from '../../../../database';
// TODO: Добавить анимацию
import * as d3select from 'd3-selection';
import * as d3hierarchy from 'd3-hierarchy';
import * as d3shape from 'd3-shape';
import numeral from 'numeral';

function createHierarchy(flow) {
  const map = {};

  function find(name, data) {
    let node = map[name];
    if (!node) {
      node = map[name] = data || { name, children: [] };
      if (name.length) {
        node.parent = find('');        
        node.parent.children.push(node);
        node.key = name;
      }
    }
    return node;
  }

  for (const [i, d] of flow) {
    find(i, d);
  }

  return d3hierarchy.hierarchy(map['']);
}

function getDebts(nodes) {
  const map = {};
  const debts = [];

  // Compute a map from name to node.
  nodes.forEach((d) => {
    map[d.data.key] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach((d) => {
    const key = d.data.key;
    d.data.debts.forEach((_d) => {
      const path = map[key].path(map[_d.receiver]);
      debts.push(path);
    });
  });

  return debts;
}

export class MoneyFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flow: null,
      nodesContainer: null,
      linksContainer: null,
      labelsContainer: null,
    };
    this.positive = [];
    this.negative = [];
    this.flow = new Map();

    this.setNodesContainer = this.setNodesContainer.bind(this);
    this.setLinksContainer = this.setLinksContainer.bind(this);
    this.setLabelsContainer = this.setLabelsContainer.bind(this);

    this.lineRenderer = d3shape.radialLine()
      .curve(d3shape.curveBundle.beta(0.25))
      .radius(d => d.y)
      .angle(d => d.x / 180 * Math.PI);
  }

  componentWillMount() {
    this.budgetSub = GlobalStore.modules.budgets.activeBudget.subscribe((budget) => this.setTransactions(budget));
  }

  componentWillUnmount() {
    GlobalStore.modules.budgets.activeBudget.unsubscribe(this.budgetSub);
    if (this.transactionsSubRx) {
      this.transactionsSubRx.unsubscribe();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    this.innerRadius = nextProps.diameter - 120;
  }

  setTransactions(budget) {
    this.transactionsQuery = Database.instance.collections.transactions.find().where({ budgetId: budget.id });
    this.transactionsSubRx = this.transactionsQuery.$.subscribe(transactions => this.setFlow(transactions));
    this.transactionsQuery
      .exec()
      .then(transactions => this.setFlow(transactions));
  }

  redraw() {
    if (
      this.state.flow === null
      || !this.linkContainer
      || !this.nodeContainer
      || !this.labelsContainer
    ) {
      return false;
    }
    const cluster = d3hierarchy.cluster().size([150, 150]);

    const root = createHierarchy(this.state.flow).sum(d => d.size);
    cluster(root);
    const links = getDebts(root.leaves());

    // TODO: сделать нормальное обновление с .enter и exit и анимацией
    this.linkContainer.selectAll('.money-flow__link').remove();
    this.labelsContainer.selectAll('.money-flow__amount').remove();
    this.nodeContainer.selectAll('.money-flow__node').remove();

    const linksDatum = this.linkContainer.selectAll('.money-flow__link').data(links);
    linksDatum.enter()
      .append('path')
      .each((d) => {
        d.source = d[0];
        d.target = d[d.length - 1];
        d.amount = d.source.data.debts.find(debt => debt.receiver === d.target.data.key).amount;
      })
      .attr('class', (d) => {
        const rootName = 'money-flow__link';
        const className = [rootName];
        if (d.amount === 0) {
          className.push('hidden');
        } else {
          if (d.target.data.key === GlobalStore.modules.users.activeUser.value.id) {
            className.push(`${rootName}--target`);
          }
          if (d.source.data.key === GlobalStore.modules.users.activeUser.value.id) {
            className.push(`${rootName}--source`);
          }
        }

        return className.join(' ');
      })
      .attr('d', this.lineRenderer)
      .attr('marker-end', 'url(#arrow)')
      .attr('id', d => `${d.source.data.key}_${d.target.data.key}`);
      
    const labels = this.labelsContainer.selectAll('.money-flow__amount').data(links);
    labels.enter()
      .append('text')
      .classed('money-flow__amount', true)
      .append('textPath')
      .attr('xlink:href', d => `#${d.source.data.key}_${d.target.data.key}`)
      .attr('startOffset', '48%')
      .text(d => d.amount > 0 ? numeral(d.amount).format('0,[.]00') : '');
        
    const nodes = this.nodeContainer.selectAll('.money-flow__node').data(root.leaves());
    nodes.enter().append('text')
        .attr('class', 'money-flow__node')
        .attr('dy', '0.31em')
        .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y + 8}, 0) ${d.x < 180 ? '' : 'rotate(180)'}`)
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .text((d) => {
          const user = GlobalStore.users.value.get(d.data.key);
          if (user.id === GlobalStore.modules.users.activeUser.value.id) {
            return 'Я';
          }
          return user.phone || user.email;
        });
  }

  setFlow(rawTransactions) {
    if (!GlobalStore.modules.budgets.activeBudget.value
      || !rawTransactions
    ) {
      return false;
    }
    const budget = GlobalStore.modules.budgets.activeBudget.value;
    const transactions = rawTransactions.filter(t => t.budgetId === budget.id);
    const balances = budgetsActions.calculateBalances(transactions, budget.users, budget.ownerId);
    this.positive = [];
    this.negative = [];
    this.flow = new Map();
    let positiveSum = 0;
    let negativeSum = 0;
    for (const [userId, balance] of balances) {
      if (balance > 0) {
        this.positive.push({ userId, balance });
        this.flow.set(userId, { debts: [] });
        positiveSum += balance;
      } else if (balance < 0) {
        this.negative.push({ userId, balance });
        negativeSum += balance;
      }
    }
    const isConvergent = (positiveSum + negativeSum) === 0;
    if (!isConvergent) {
      console.error('Баланс не сходится!', positiveSum, negativeSum);
    }
    this.negative.forEach((donor) => {
      let remainingDebt = donor.balance;
      const donorFlow = [];
      for (let i = 0; i < this.positive.length && donor.balance !== 0; i++) {
        if (this.positive[i].balance !== 0) {
          remainingDebt = this.positive[i].balance + donor.balance;
          if (remainingDebt >= 0) {
            this.positive[i].balance = remainingDebt;
            donorFlow.push({
              receiver: this.positive[i].userId,
              amount: -donor.balance,
            });
            donor.balance = 0;
          } else {
            donor.balance = remainingDebt;
            donorFlow.push({
              receiver: this.positive[i].userId,
              amount: this.positive[i].balance,
            });
            this.positive[i].balance = 0;
          }
        }
      }
      this.flow.set(donor.userId, { debts: donorFlow });
    });
    this.setState({
      flow: this.flow,
    });
    this.redraw();
  }

  setNodesContainer(element) {
    if (!element) {
      return false;
    }
    this.setState({
      nodesContainer: element,
    });
    this.nodeContainer = d3select.select(element);
    this.redraw();
  }

  setLinksContainer(element) {
    if (!element) {
      return false;
    }
    this.setState({
      linksContainer: element,
    });
    this.linkContainer = d3select.select(element);
        
    this.redraw();
  }
  
  setLabelsContainer(element) {
    if (!element) {
      return false;
    }
    this.setState({
      labelsContainer: element,
    });
    this.labelsContainer = d3select.select(element);
    this.redraw();
  }


  render() {
    return presenter({
      ...this.props,
      ...this.state,
      setNodesContainer: this.setNodesContainer,
      setLinksContainer: this.setLinksContainer,
      setLabelsContainer: this.setLabelsContainer,
      setContainer: this.setContainer,
    });
  }
}
