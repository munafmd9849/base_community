{
  "name": "Member",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Full name of the member"
    },
    "username": {
      "type": "string",
      "description": "Unique username/ID for tracking"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Email address"
    },
    "profileImage": {
      "type": "string",
      "description": "URL to profile image"
    },
    "classesJoined": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of class/contest IDs the user participated in"
    },
    "leetcodeUsername": {
      "type": "string",
      "description": "LeetCode username for auto-import"
    },
    "codeforcesUsername": {
      "type": "string",
      "description": "Codeforces username"
    },
    "gfgUsername": {
      "type": "string",
      "description": "GeeksforGeeks username"
    },
    "totalScore": {
      "type": "number",
      "default": 0,
      "description": "Total accumulated score"
    },
    "problemsSolved": {
      "type": "number",
      "default": 0,
      "description": "Total problems solved"
    },
    "accuracy": {
      "type": "number",
      "default": 0,
      "description": "Overall accuracy percentage"
    }
  },
  "required": [
    "name",
    "username",
    "email"
  ]
}