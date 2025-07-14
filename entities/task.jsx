{
  "name": "Task",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Task title"
    },
    "description": {
      "type": "string",
      "description": "Task description or notes"
    },
    "category": {
      "type": "string",
      "enum": [
        "DSA",
        "UI/UX",
        "Reading",
        "Coding",
        "Learning",
        "Project",
        "Other"
      ],
      "default": "Other",
      "description": "Task category"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Task tags"
    },
    "status": {
      "type": "string",
      "enum": [
        "todo",
        "in_progress",
        "done"
      ],
      "default": "todo",
      "description": "Task status"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high"
      ],
      "default": "medium",
      "description": "Task priority"
    },
    "due_date": {
      "type": "string",
      "format": "date",
      "description": "Task due date"
    }
  },
  "required": [
    "title"
  ]
}