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
FloorObjectsTable = Table(
    "FloorObjectsTable",
    BillingMode="PAY_PER_REQUEST",
    TableName="FloorObjects",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName=objectIdAttribute,
            AttributeType="S"
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
            IndexName="floorIndex",
            KeySchema=[
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

FloorsTable = Table(
    "FloorsTable",
    BillingMode="PAY_PER_REQUEST",
    TableName="Floors",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName=floorAttribute,
            AttributeType="S"
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName=floorAttribute,
            KeyType="HASH"
        )
    ],
    StreamSpecification=StreamSpecification(
        StreamViewType="NEW_AND_OLD_IMAGES"
    )
)


def addTables(t): 
    t.add_resource(ConnectionsTable)
    t.add_resource(FloorsTable)
    t.add_resource(FloorObjectsTable)

    t.add_output([
        Output(
            "ConnectionsTable",
            Value=Ref(ConnectionsTable)
        ),
        Output(
            "FloorObjectsTable",
            Value=Ref(FloorObjectsTable)
        )
    ])