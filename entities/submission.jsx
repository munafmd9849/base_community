{
  "name": "Submission",
  "type": "object",
  "properties": {
    "classId": {
      "type": "string",
      "description": "ID of the class/contest"
    },
    "memberId": {
      "type": "string",
      "description": "ID of the member who submitted"
    },
    "memberUsername": {
      "type": "string",
      "description": "Username of the member"
    },
    "problemName": {
      "type": "string",
      "description": "Name of the problem"
    },
    "problemLink": {
      "type": "string",
      "description": "Link to the problem"
    },
    "verdict": {
      "type": "string",
      "enum": [
        "AC",
        "WA",
        "TLE",
        "RE",
        "CE",
        "PE",
        "OLE"
      ],
      "description": "Submission verdict"
    },
    "language": {
      "type": "string",
      "enum": [
        "C++",
        "Python",
        "Java",
        "JavaScript",
        "C",
        "Go",
        "Rust",
        "Other"
      ],
      "description": "Programming language used"
    },
    "codeSubmitted": {
      "type": "string",
      "description": "Full submitted code"
    },
    "submissionTime": {
      "type": "string",
      "format": "date-time",
      "description": "Exact submission timestamp"
    },
    "attempts": {
      "type": "number",
      "default": 1,
      "description": "Number of attempts for this problem"
    },
    "timeTaken": {
      "type": "number",
      "description": "Time taken to solve in minutes"
    },
    "score": {
      "type": "number",
      "default": 0,
      "description": "Points scored for this submission"
    },
    "platform": {
      "type": "string",
      "description": "Platform where the problem was solved"
    },
    "isLatestAC": {
      "type": "boolean",
      "default": false,
      "description": "Whether this is the latest accepted solution"
    }
  },
  "required": [
    "classId",
    "memberId",
    "memberUsername",
    "problemName",
    "verdict",
    "language",
    "submissionTime"
  ]
}