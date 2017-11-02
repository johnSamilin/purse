const schemas = {
	budgets: {
		"title": "budgets",
		"version": 0,
		"description": "budgets",
		"type": "object",
		"disableKeyCompression": true,
		"properties": {
			"id": {
				"type": "string",
				"primary": true
			},
			"ownerId": {
				"type": "string"
			},
			"state": {
				"type": "string",
				"enum": ["opened", "closed"]
			},
			"title": {
				"type": "string"
			},
			"currency": {
				"type": "object",
				"properties": {
					"key": {
						"type": "string"
					},
					"label": {
						"type": "string"
					}
				}
			},
			"sharelink": {
				"type": "string"
			},
			"users": {
				"type": "array",
				"properties": {
					"id": "string",
					"status": {
						"type": "string",
						"enum": ["active", "pending", "removed", "invited"]
					}
				},
				"required": [
					"id",
				]
			},
		}
	},
	transactions: {
		"title": "transactions",
		"version": 0,
		"description": "transactions",
		"type": "object",
		"disableKeyCompression": true,
		"properties": {
	        "id": {
	        	"type": "string",
	        	"primary": true
	        },
	        "budgetId": {
	        	"type": "string"
	        },
	        "amount": {
	        	"type": "number"
	        },
	        "date": {
	        	"type": "string"
	        },
	        "note": {
	        	"type": "string"
	        },
	        "cancelled": {
	        	"type": "boolean"
	        },
	        "ownerId": {
	        	"type": "string"
	        }
        },
    },
	users: {
		"title": "users",
		"version": 1,
		"description": "users",
		"type": "object",
		"disableKeyCompression": true,
		"properties": {
	        "id": {
	        	"type": "string",
	        	"primary": true
	        },
			"name": {
				"type": "string"
			},
			"phone": {
				"type": "string"
			},
			"email": {
				"type": "string"
			},
			"token": {
				"type": "string",
			},
		},
		"migrationStrategies": {
			1: function (user) {
				user.token = '';
				return user;
			},
		},
	},
	seenTransactions: {
		"title": "seentransactions",
		"version": 0,
		"description": "",
		"type": "object",
		"disableKeyCompression": true,
		"properties": {
			"budgetId": {
				"type": "string",
				"primary": true,
			},
			"transactions": {
				"type": "number",
			},
		},
	},
};

export default schemas;