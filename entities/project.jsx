{
  "name": "Project",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Project title"
    },
    "description": {
      "type": "string",
      "description": "Project description"
    },
    "github_url": {
      "type": "string",
      "description": "GitHub repository URL"
    },
    "live_url": {
      "type": "string",
      "description": "Live demo URL"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Project tags/technologies"
    },
    "status": {
      "type": "string",
      "enum": [
        "planning",
        "in_progress",
        "completed",
        "deployed"
      ],
      "default": "planning",
      "description": "Project status"
    },
    "featured": {
      "type": "boolean",
      "default": false,
      "description": "Featured project"
    }
  },
  "required": [
    "title",
    "description"
  ]
}