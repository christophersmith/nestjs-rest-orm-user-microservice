CREATE TABLE [User]
(
    [UserId]          int IDENTITY(1,1) NOT NULL,
    [Email]           varchar(255)      NOT NULL,
    [FirstName]       varchar(64)       NOT NULL,
    [LastName]        varchar(64)       NOT NULL,
    [CreatedDateTime] datetime2(6)      NOT NULL,
    [UpdatedDateTime] datetime2(6)      NOT NULL,
    CONSTRAINT [User_PK] PRIMARY KEY CLUSTERED
    (
        [UserId]
    )
);

CREATE UNIQUE INDEX [User_UX] ON [User] ([Email]);
