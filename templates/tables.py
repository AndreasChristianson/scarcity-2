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
chatIdAttribute = "chatId"


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
            IndexName="byFloor",
            KeySchema=[
                KeySchema(
                    AttributeName=floorAttribute,
                    KeyType="HASH"
                ),
            ],
            Projection=Projection(
                ProjectionType="INCLUDE",
                NonKeyAttributes=["connectionIdAttribute"]
            )
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
            IndexName="byFloor",
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

ChatTable = Table(
    "ChatTable",
    BillingMode="PAY_PER_REQUEST",
    TableName="Chat",
    AttributeDefinitions=[
        AttributeDefinition(
            AttributeName=chatIdAttribute,
            AttributeType="S"
        ),
        AttributeDefinition(
            AttributeName="timestamp",
            AttributeType="N"
        ),
        AttributeDefinition(
            AttributeName="parent",
            AttributeType="S"
        ),
        AttributeDefinition(
            AttributeName="source",
            AttributeType="S"
        ),
    ],
    KeySchema=[
        KeySchema(
            AttributeName="timestamp",
            KeyType="RANGE"
        ),
        KeySchema(
            AttributeName=chatIdAttribute,
            KeyType="HASH"
        ),
    ],
    GlobalSecondaryIndexes=[
        GlobalSecondaryIndex(
            IndexName="byParent",
            KeySchema=[
                KeySchema(
                    AttributeName="parent",
                    KeyType="HASH"
                ),
                KeySchema(
                    AttributeName="timestamp",
                    KeyType="RANGE"
                ),
            ],
            Projection=Projection(
                ProjectionType="ALL"
            ),
        ),
        GlobalSecondaryIndex(
            IndexName="bySource",
            KeySchema=[
                KeySchema(
                    AttributeName="source",
                    KeyType="HASH"
                ),
                KeySchema(
                    AttributeName="timestamp",
                    KeyType="RANGE"
                ),
            ],
            Projection=Projection(
                ProjectionType="ALL"
            ),
        ),
    ],
    StreamSpecification=StreamSpecification(
        StreamViewType="NEW_AND_OLD_IMAGES"
    )
)


def addTables(t): 
    t.add_resource(ConnectionsTable)
    t.add_resource(FloorsTable)
    t.add_resource(FloorObjectsTable)
    t.add_resource(ChatTable)

    t.add_output([
        Output(
            "ConnectionsTable",
            Value=Ref(ConnectionsTable)
        ),
        Output(
            "ChatTable",
            Value=Ref(ChatTable)
        ),
        Output(
            "FloorObjectsTable",
            Value=Ref(FloorObjectsTable)
        )
    ])