// token_mint.ts
import * as web3 from '@solana/web3.js';
import { DataV2, Creator } from '@metaplex-foundation/mpl-token-metadata';
import { ResearchProgramT } from './research';

async function uploadJson(data){
    const random = (Math.random() * 454654).toString(16).replace('.','')
    const url = `https://api.jsonstorage.net/v1/json?apiKey=8bc161f7-89b3-4f7e-a981-902e9d73289c&name=${random}`;
    const res = await fetch(url, {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    });
    if(res.ok){
        let to_json = await res.json();
        console.log("Uploaded successfully!");
        return to_json;
    } else {
        console.log(res)
    }
}


// async function main(){
//     let some_gibberish = {
//         name:"ao",
//         last_name: "sawari",
//         age: 26
//     }

//     let res = await uploadJson(some_gibberish);
//     console.log(res);
// }

// main()




export interface ExtendedMetadata extends ResearchProgramT {
    externalUrl?: string;
    description?: string;
    image?: string;
    attributes?: Array<{
        trait_type: string;
        value: string;
    }>;
}

export async function createEnhancedMetadata(
    metadata: ExtendedMetadata,
    creatorAddress: web3.PublicKey
): Promise<DataV2> {
    // Create a creator object with your wallet as the creator
    const creators: Creator[] = [{
        address: creatorAddress,
        verified: true,
        share: 100
    }];

    // Format attributes from research metadata
    const attributes = [
      {
        trait_type: "title",
        value: metadata.title
      },
      {
        trait_type: "Summary",
        value: metadata.summary
      },
        {
            trait_type: "Institution",
            value: metadata.institutions
        },
        {
            trait_type: "Field",
            value: metadata.field
        },
        {
            trait_type: "Keywords",
            value: metadata.keywords
        }
    ];


    // const res = await uploadJson(metadata);
    


    // Create on-chain metadata
    const metadataData: DataV2 = {
        name: metadata.title,
        symbol: metadata.title.split("(")[1]?.split(")")[0] || "RSCH",
        uri: "", // Replace with your uploaded metadata URI
        sellerFeeBasisPoints: 0,
        creators: creators,
        collection: null,
        uses: null
    };

    return metadataData;
}


// Use this in your mint_with_metadata.ts:
/*
const metadataData = await createEnhancedMetadata(
    enhancedMetadata,
    wallet.publicKey
);
*/