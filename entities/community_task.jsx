{
  "name": "CommunityTask",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "The title of the community task"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of what needs to be done"
    },
    "platform": {
      "type": "string",
      "enum": [
        "LeetCode",
        "GitHub",
        "GFG",
        "HackerRank",
        "Project",
        "Other"
      ],
      "description": "The platform this task relates to"
    },
    "link": {
      "type": "string",
      "description": "A direct link to the task (e.g., LeetCode problem URL)"
    },
    "deadline": {
      "type": "string",
      "format": "date",
      "description": "The deadline for completing the task"
    },
    "difficulty": {
      "type": "string",
      "enum": [
        "Easy",
        "Medium",
        "Hard"
      ],
      "default": "Medium"
    },
    "points": {
      "type": "number",
      "description": "Points awarded for completing the task"
    }
  },
  "required": [
    "title",
    "platform",
    "points"
  ]
}