import aws from 'aws-sdk';

exports.handler = async (event, context) => {
    const postData = JSON.parse(event.body).data;

    return { 
        statusCode: 200, 
        body: {
            echo: true,
            ...postData
        } 
    };
};
