{
  "name": "Post",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Post title"
    },
    "content": {
      "type": "string",
      "description": "Post content"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Post tags"
    },
    "type": {
      "type": "string",
      "enum": [
        "update",
        "achievement",
        "learning",
        "reflection"
      ],
      "default": "update",
      "description": "Post type"
    }
  },
  "required": [
    "title",
    "content"
  ]
}