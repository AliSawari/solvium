/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solvium.json`.
 */
export type Solvium = {
  "address": "Cheg7SgQmMGzNwBfGL7jWCVjRaVQityvRfjLsqzTAkV2",
  "metadata": {
    "name": "solvium",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeResearch",
      "discriminator": [
        234,
        95,
        26,
        42,
        43,
        5,
        175,
        75
      ],
      "accounts": [
        {
          "name": "research",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
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
          "name": "subfields",
          "type": {
            "vec": "string"
          }
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
        }
      ]
    },
    {
      "name": "updateMetadata",
      "discriminator": [
        170,
        182,
        43,
        239,
        97,
        78,
        225,
        186
      ],
      "accounts": [
        {
          "name": "research",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "research"
          ]
        }
      ],
      "args": [
        {
          "name": "fieldName",
          "type": "string"
        },
        {
          "name": "newValue",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateStatus",
      "discriminator": [
        147,
        215,
        74,
        174,
        55,
        191,
        42,
        0
      ],
      "accounts": [
        {
          "name": "research",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "research"
          ]
        }
      ],
      "args": [
        {
          "name": "newStatus",
          "type": {
            "defined": {
              "name": "researchStatus"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "research",
      "discriminator": [
        116,
        214,
        122,
        13,
        126,
        152,
        168,
        123
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidField",
      "msg": "Invalid field name provided"
    },
    {
      "code": 6001,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    }
  ],
  "types": [
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
            "name": "subfields",
            "type": {
              "vec": "string"
            }
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
              "defined": {
                "name": "researchStatus"
              }
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
            "name": "lastUpdated",
            "type": "i64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
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
    },
    {
      "name": "researchStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ongoing"
          },
          {
            "name": "completed"
          },
          {
            "name": "peerReview"
          },
          {
            "name": "published"
          }
        ]
      }
    }
  ]
};
