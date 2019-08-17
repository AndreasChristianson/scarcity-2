import {processRecords} from '../util/ddb-stream';

export const handler = async ({Records}, context, callback) =>
    processRecords(Records, (context) => 
        console.log(context)
    );
