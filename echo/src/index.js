import aws from 'aws-sdk';

exports.handler = async (event, context) => {
    const postData = JSON.parse(event.body).data;

    console.info({event})

    return { 
        statusCode: 200, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            echo: true,
            ...postData
        })
    };
};
