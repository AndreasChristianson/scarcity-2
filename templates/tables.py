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
positionXAttribute = "positionX"
positionYAttribute = "positionY"
connectionIdAttribute = "connectionId"
objectIdAttribute = "objectId"


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
    ]
)
ObjectsTable = Table(
    "ObjectsTable",
    BillingMode="PAY_PER_REQUEST",
    TableName="Objects",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName=objectIdAttribute,
            AttributeType="S"
        ),
        AttributeDefinition(
            AttributeName=positionXAttribute,
            AttributeType="N"
        ),
        AttributeDefinition(
            AttributeName=positionXAttribute,
            AttributeType="N"
        ),
        AttributeDefinition(
            AttributeName=floorAttribute,
            AttributeType="S"
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName=objectIdAttribute,
            KeyType="HASH"
        )
    ],
    StreamSpecification=StreamSpecification(
        StreamViewType="NEW_AND_OLD_IMAGES"
    ),
    GlobalSecondaryIndexes=[
        GlobalSecondaryIndex(
            IndexName="positionIndex",
            KeySchema=[
                KeySchema(
                    AttributeName=positionXAttribute,
                    KeyType="RANGE"
                ),
                KeySchema(
                    AttributeName=positionYAttribute,
                    KeyType="RANGE"
                ),
                KeySchema(
                    AttributeName=floorAttribute,
                    KeyType="HASH"
                ),
            ],
            Projection=Projection(
                ProjectionType="ALL"
            ),
        ),
    ]
)


def addTables(t): 
    t.add_resource(ConnectionsTable)
    t.add_resource(ObjectsTable)

    t.add_output(Output(
        "ConnectionsTable",
        Value=Ref(ConnectionsTable)
    ))    
    t.add_output(Output(
        "ObjectsTable",
        Value=Ref(ObjectsTable)
    ))