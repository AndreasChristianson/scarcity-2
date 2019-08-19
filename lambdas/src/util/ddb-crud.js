import AWS from 'aws-sdk';
import {getLogger} from './logger';

const ddb = new AWS.DynamoDB.DocumentClient();
const logger = getLogger('ddb');

export const updateField = async (table, pk, field, value) => {
    const updateParams = {
        TableName: table,
        Key: pk,
        UpdateExpression: `set ${field}=:f`,
        ExpressionAttributeValues: {
            ':f': value
        },
        ReturnValues: 'UPDATED_NEW'
    };

    return accessDDb("update", updateParams);
};

export const accessDDb = async (method, parameters) => {
    try {
        logger.trace('accessing dynamo db', { method, parameters });
        const returnValue = await ddb[method](parameters).promise();
        logger.trace('fetched', { returnValue });
        return returnValue;
    } catch (error) {
        logger.error('error when accessing dynamo db', { error, method, parameters });
        throw error;
    }
};

export const queryDDbByFields = async ({table, index, fields}) => {
    const KeyConditionExpression = Object.keys(fields)
        .map((key) => `#${key} = :${key}`)
        .join(' and ');
    const ExpressionAttributeNames = Object.keys(fields).reduce(
        (accum, curr) => ({
            [`#${curr}`]: curr,
            ...accum
        }),
        {}
    );
    const ExpressionAttributeValues = Object.keys(fields).reduce(
        (accum, curr) => ({
            [`:${curr}`]: fields[curr],
            ...accum
        }),
        {}
    );
    const params = {
        IndexName: index,
        TableName : table,
        KeyConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues
    };
    return queryDDb(params);
};

export const queryDDb = async (params) => {
    const {Items, Count} = await accessDDb("query", params);
    logger.trace(`fetched ${Items.length} objects via query`);
    return Items;
};
