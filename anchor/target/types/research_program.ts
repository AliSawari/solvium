export type ResearchProgram = {
  "version": "0.1.0",
  "name": "research_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "researchAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "summary",
          "type": "string"
        },
        {
          "name": "institutions",
          "type": "string"
        },
        {
          "name": "field",
          "type": "string"
        },
        {
          "name": "keywords",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "researchAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "summary",
            "type": "string"
          },
          {
            "name": "institutions",
            "type": "string"
          },
          {
            "name": "field",
            "type": "string"
          },
          {
            "name": "keywords",
            "type": "string"
          }
        ]
      }
    }
  ]
};

export const IDL: ResearchProgram = {
  "version": "0.1.0",
  "name": "research_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "researchAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "summary",
          "type": "string"
        },
        {
          "name": "institutions",
          "type": "string"
        },
        {
          "name": "field",
          "type": "string"
        },
        {
          "name": "keywords",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "researchAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "summary",
            "type": "string"
          },
          {
            "name": "institutions",
            "type": "string"
          },
          {
            "name": "field",
            "type": "string"
          },
          {
            "name": "keywords",
            "type": "string"
          }
        ]
      }
    }
  ]
};
