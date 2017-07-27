const schemas = {
	budgets: {
		"title": "budgets",
		"version": 0,
		"description": "budgets",
		"type": "object",
		"properties": {
			"id": {
				"type": "string",
				"primary": true
			},
			"ownerId": {
				"type": "integer"
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
						"enum": ["active", "pending", "removed"]
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
	        	"type": "number"
	        }
        },
    },
	users: {
		"title": "users",
		"version": 0,
		"description": "users",
		"type": "object",
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
	    },
    },
};

export default schemas;