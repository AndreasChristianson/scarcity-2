import {getLogger} from '../util/logger'

const logger = getLogger();

export const handler = async (event, context) => {
    const request = JSON.parse(event.body);
    logger.warn('Bad request', {request, context});

    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: `Bad request: ${request}`
    };
};
