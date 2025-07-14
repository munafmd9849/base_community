{
  "name": "ClassContest",
  "type": "object",
  "properties": {
    "date": {
      "type": "string",
      "format": "date",
      "description": "Class or contest date"
    },
    "className": {
      "type": "string",
      "description": "Descriptive name of the class/contest"
    },
    "contentCovered": {
      "type": "string",
      "description": "Topics taught or discussed in the class"
    },
    "problems": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "problemName": {
            "type": "string"
          },
          "problemLink": {
            "type": "string"
          },
          "platform": {
            "type": "string",
            "enum": [
              "LeetCode",
              "GFG",
              "Codeforces",
              "HackerRank",
              "Other"
            ]
          },
          "category": {
            "type": "string",
            "enum": [
              "Easy",
              "Medium",
              "Hard",
              "DP",
              "Greedy",
              "Graph",
              "Array",
              "String",
              "Tree",
              "Other"
            ]
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "description": "List of problems covered in the class"
    },
    "classNotes": {
      "type": "string",
      "description": "Class notes or file URL"
    },
    "instructorName": {
      "type": "string",
      "description": "Name of the instructor"
    },
    "duration": {
      "type": "number",
      "description": "Class duration in minutes"
    },
    "isContest": {
      "type": "boolean",
      "default": false,
      "description": "Whether this is a contest or regular class"
    },
    "contestEndTime": {
      "type": "string",
      "format": "date-time",
      "description": "Contest end time if applicable"
    }
  },
  "required": [
    "date",
    "className",
    "contentCovered",
    "problems"
  ]
}