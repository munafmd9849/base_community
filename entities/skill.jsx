{
  "name": "Skill",
  "type": "object",
  "properties": {
    "skillName": {
      "type": "string",
      "description": "Name of the skill"
    },
    "category": {
      "type": "string",
      "enum": [
        "Technical",
        "Soft Skill",
        "Language",
        "Creative",
        "Business",
        "Other"
      ],
      "default": "Technical",
      "description": "Skill category"
    },
    "proficiency": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "default": 0,
      "description": "Proficiency level from 0-100"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Skill tags for categorization"
    },
    "badgeIcon": {
      "type": "string",
      "default": "🏆",
      "description": "Emoji or icon for the skill badge"
    },
    "projectLink": {
      "type": "string",
      "description": "Link to related project or portfolio"
    },
    "certificateUrl": {
      "type": "string",
      "description": "URL to uploaded certificate file"
    },
    "description": {
      "type": "string",
      "description": "Description of the skill and experience"
    },
    "isPublic": {
      "type": "boolean",
      "default": true,
      "description": "Whether skill is visible on public profile"
    }
  },
  "required": [
    "skillName",
    "category",
    "proficiency"
  ]
}