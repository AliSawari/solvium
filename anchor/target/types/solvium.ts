export type Solvium = {
  "version": "0.1.0",
  "name": "solvium",
  "instructions": [
    {
      "name": "initializeResearch",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
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
          "name": "abstractText",
          "type": "string"
        },
        {
          "name": "researchers",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "institution",
          "type": "string"
        },
        {
          "name": "field",
          "type": "string"
        },
        {
          "name": "keywords",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "methodology",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "version",
          "type": "string"
        },
        {
          "name": "tokenSymbol",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "research",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "abstractText",
            "type": "string"
          },
          {
            "name": "researchers",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "institution",
            "type": "string"
          },
          {
            "name": "field",
            "type": "string"
          },
          {
            "name": "keywords",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": "ResearchStatus"
            }
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "completionDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "version",
            "type": "string"
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "tokenSymbol",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "tokenPrice",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "methodology",
            "type": {
              "option": {
                "vec": "string"
              }
            }
          },
          {
            "name": "subfields",
            "type": {
              "option": {
                "vec": "string"
              }
            }
          },
          {
            "name": "publicationDoi",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "citationCount",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "impactFactor",
            "type": {
              "option": "f64"
            }
          },
          {
            "name": "fundingSource",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "grantAmount",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "grantId",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "datasetLocation",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "datasetSize",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "datasetFormat",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ResearchStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Ongoing"
          },
          {
            "name": "Completed"
          },
          {
            "name": "PeerReview"
          },
          {
            "name": "Published"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SymbolTooLong",
      "msg": "Symbol must be 10 characters or less"
    }
  ]
};

export const IDL: Solvium = {
  "version": "0.1.0",
  "name": "solvium",
  "instructions": [
    {
      "name": "initializeResearch",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
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
          "name": "abstractText",
          "type": "string"
        },
        {
          "name": "researchers",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "institution",
          "type": "string"
        },
        {
          "name": "field",
          "type": "string"
        },
        {
          "name": "keywords",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "methodology",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "version",
          "type": "string"
        },
        {
          "name": "tokenSymbol",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "research",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "abstractText",
            "type": "string"
          },
          {
            "name": "researchers",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "institution",
            "type": "string"
          },
          {
            "name": "field",
            "type": "string"
          },
          {
            "name": "keywords",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": "ResearchStatus"
            }
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "completionDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "version",
            "type": "string"
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "tokenSymbol",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "tokenPrice",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "methodology",
            "type": {
              "option": {
                "vec": "string"
              }
            }
          },
          {
            "name": "subfields",
            "type": {
              "option": {
                "vec": "string"
              }
            }
          },
          {
            "name": "publicationDoi",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "citationCount",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "impactFactor",
            "type": {
              "option": "f64"
            }
          },
          {
            "name": "fundingSource",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "grantAmount",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "grantId",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "datasetLocation",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "datasetSize",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "datasetFormat",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ResearchStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Ongoing"
          },
          {
            "name": "Completed"
          },
          {
            "name": "PeerReview"
          },
          {
            "name": "Published"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SymbolTooLong",
      "msg": "Symbol must be 10 characters or less"
    }
  ]
};
