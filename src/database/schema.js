const schemas = {
  budgets: {
    title: 'budgets',
    version: 3,
    description: 'budgets',
    type: 'object',
    disableKeyCompression: true,
    properties: {
      id: {
        type: 'string',
        primary: true,
      },
      ownerId: {
        type: 'string',
      },
      state: {
        type: 'string',
        enum: ['opened', 'closed', 'closing'],
      },
      title: {
        type: 'string',
      },
      currency: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
          },
          label: {
            type: 'string',
          },
        },
      },
      sharelink: {
        type: 'string',
      },
      users: {
        type: 'array',
        properties: {
          id: 'string',
          status: {
            type: 'string',
            enum: ['active', 'pending', 'removed', 'invited'],
          },
          decision: {
            type: 'string',
            enum: ['pending', 'approved'],
          },
        },
        required: [
          'id',
        ],
      },
      isSynced: {
        type: 'boolean',
      },
    },
  },
  transactions: {
    title: 'transactions',
    version: 1,
    description: 'transactions',
    type: 'object',
    disableKeyCompression: true,
    properties: {
      id: {
        type: 'string',
        primary: true,
      },
      budgetId: {
        type: 'string',
      },
      amount: {
        type: 'number',
      },
      date: {
        type: 'string',
      },
      note: {
        type: 'string',
      },
      cancelled: {
        type: 'boolean',
      },
      ownerId: {
        type: 'string',
      },
      isSynced: {
        type: 'boolean',
      },
    },
  },
  users: {
    title: 'users',
    version: 2,
    description: 'users',
    type: 'object',
    disableKeyCompression: true,
    properties: {
      id: {
        type: 'string',
        primary: true,
      },
      name: {
        type: 'string',
      },
      phone: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      token: {
        type: 'string',
      },
      isSynced: {
        type: 'boolean',
      },
    },
  },
  seenTransactions: {
    title: 'seentransactions',
    version: 0,
    description: '',
    type: 'object',
    disableKeyCompression: true,
    properties: {
      budgetId: {
        type: 'string',
        primary: true,
      },
      transactions: {
        type: 'number',
      },
    },
  },
};

export default schemas;
