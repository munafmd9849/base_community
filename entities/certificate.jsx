{
  "name": "Certificate",
  "type": "object",
  "properties": {
    "memberId": {
      "type": "string",
      "description": "ID of the member"
    },
    "memberName": {
      "type": "string",
      "description": "Name of the member"
    },
    "classId": {
      "type": "string",
      "description": "ID of the completed class/contest"
    },
    "className": {
      "type": "string",
      "description": "Name of the completed class/contest"
    },
    "score": {
      "type": "number",
      "description": "Final score achieved"
    },
    "completionDate": {
      "type": "string",
      "format": "date",
      "description": "Date of completion"
    },
    "instructorName": {
      "type": "string",
      "description": "Name of the instructor"
    },
    "instructorSignature": {
      "type": "string",
      "description": "URL to instructor signature image"
    },
    "certificateType": {
      "type": "string",
      "enum": [
        "Class Completion",
        "Contest Winner",
        "Course Completion",
        "Achievement"
      ],
      "description": "Type of certificate"
    },
    "certificateUrl": {
      "type": "string",
      "description": "URL to generated certificate PDF"
    },
    "isIssued": {
      "type": "boolean",
      "default": false,
      "description": "Whether certificate has been generated and issued"
    }
  },
  "required": [
    "memberId",
    "memberName",
    "classId",
    "className",
    "completionDate",
    "certificateType"
  ]
}