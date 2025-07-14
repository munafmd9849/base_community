{
  "name": "Badge",
  "type": "object",
  "properties": {
    "badgeName": {
      "type": "string",
      "description": "Name of the badge"
    },
    "badgeIcon": {
      "type": "string",
      "description": "Emoji or icon for the badge"
    },
    "criteria": {
      "type": "string",
      "description": "Criteria for earning the badge"
    },
    "badgeType": {
      "type": "string",
      "enum": [
        "skill_count",
        "proficiency",
        "certificate",
        "category",
        "special"
      ],
      "description": "Type of badge"
    },
    "dateAwarded": {
      "type": "string",
      "format": "date",
      "description": "Date when badge was awarded"
    },
    "userId": {
      "type": "string",
      "description": "User who earned the badge"
    }
  },
  "required": [
    "badgeName",
    "badgeIcon",
    "criteria",
    "badgeType",
    "userId"
  ]
}