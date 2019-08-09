from troposphere import Output, Parameter, Ref, Template
from troposphere.dynamodb import (
    KeySchema, 
    AttributeDefinition, 
    ProvisionedThroughput, 
    TimeToLiveSpecification, 
    Table, 
    GlobalSecondaryIndex, 
    Projection,
    StreamSpecification
)

import constants


ttlAttribute = "ttl"
accountIdAttribute = "accountId"
floorAttribute = "floor"
positionAttribute = "position"
connectionIdAttribute = "connectionId"


ConnectionsTable = Table(
    "ConnectionsTable",
    BillingMode="PAY_PER_REQUEST",
    TableName="Connections",
    TimeToLiveSpecification=TimeToLiveSpecification(
        AttributeName=ttlAttribute,
        Enabled=True
    ),
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName=connectionIdAttribute,
            AttributeType="S"
        ),
        AttributeDefinition(
            AttributeName=accountIdAttribute,
            AttributeType="S"
        ),
        AttributeDefinition(
            AttributeName=floorAttribute,
            AttributeType="S"
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName=connectionIdAttribute,
            KeyType="HASH"
        )
    ],
    StreamSpecification=StreamSpecification(
        StreamViewType="NEW_AND_OLD_IMAGES"
    ),
    GlobalSecondaryIndexes=[
        GlobalSecondaryIndex(
            IndexName="accountIndex",
            KeySchema=[
                KeySchema(
                    AttributeName=accountIdAttribute,
                    KeyType="HASH"
                ),
            ],
            Projection=Projection(
                ProjectionType="KEYS_ONLY"
            ),
        ),
        GlobalSecondaryIndex(
            IndexName="floorIndex",
            KeySchema=[
                KeySchema(
                    AttributeName=floorAttribute,
                    KeyType="HASH"
                ),
            ],
            Projection=Projection(
                NonKeyAttributes=[
                    positionAttribute
                ],
                ProjectionType="INCLUDE"
            ),
        )
    ]
)


def addTables(t): 
    t.add_resource(ConnectionsTable)

    t.add_output(Output(
        "ConnectionsTable",
        Value=Ref(ConnectionsTable)
    ))