-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-07-27 04:12:27.658

-- tables
-- Table: BlacklistTokens
CREATE TABLE dbo.BlacklistTokens (
    id int  NOT NULL IDENTITY(1, 1),
    token nvarchar(255)  NOT NULL,
    createdAt datetimeoffset(7)  NOT NULL,
    updatedAt datetimeoffset(7)  NOT NULL,
    CONSTRAINT AK_0 UNIQUE NONCLUSTERED (token) WITH (PAD_INDEX = OFF , STATISTICS_NORECOMPUTE = OFF , IGNORE_DUP_KEY = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON , OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON PRIMARY,
    CONSTRAINT "dbo.BlacklistTokens_pk" PRIMARY KEY CLUSTERED (id)
)
ON PRIMARY;

-- Table: Cards
CREATE TABLE dbo.Cards (
    id int  NOT NULL IDENTITY(1, 1),
    color nvarchar(255)  NOT NULL,
    value nvarchar(255)  NOT NULL,
    points int  NOT NULL,
    image nvarchar(255)  NOT NULL,
    gameId int  NOT NULL,
    whoOwnerCard int  NULL,
    orderDiscarded int  NULL DEFAULT NULL,
    auditExcluded bit  NOT NULL DEFAULT ( 0 ),
    createdAt datetimeoffset(7)  NOT NULL,
    updatedAt datetimeoffset(7)  NOT NULL,
    CONSTRAINT "dbo.Cards_pk" PRIMARY KEY CLUSTERED (id)
)
ON PRIMARY;

-- Table: GamePlayers
CREATE TABLE dbo.GamePlayers (
    id int  NOT NULL IDENTITY(1, 1),
    playerId int  NOT NULL,
    gameId int  NOT NULL,
    status bit  NOT NULL DEFAULT ( 0 ),
    score int  NOT NULL DEFAULT ( 0 ),
    auditExcluded bit  NOT NULL DEFAULT ( 0 ),
    createdAt datetimeoffset(7)  NOT NULL,
    updatedAt datetimeoffset(7)  NOT NULL,
    CONSTRAINT "dbo.GamePlayers_pk" PRIMARY KEY CLUSTERED (id)
)
ON PRIMARY;

-- Table: Games
CREATE TABLE dbo.Games (
    id int  NOT NULL IDENTITY(1, 1),
    title nvarchar(255)  NOT NULL,
    status nvarchar(255)  NOT NULL,
    maxPlayers int  NOT NULL,
    creatorId int  NOT NULL,
    currentPlayer int  NULL,
    auditExcluded bit  NOT NULL DEFAULT ( 0 ),
    createdAt datetimeoffset(7)  NOT NULL,
    updatedAt datetimeoffset(7)  NOT NULL,
    CONSTRAINT "dbo.Games_pk" PRIMARY KEY CLUSTERED (id)
)
ON PRIMARY;

-- Table: Players
CREATE TABLE dbo.Players (
    id int  NOT NULL IDENTITY(1, 1),
    username nvarchar(255)  NOT NULL,
    password nvarchar(255)  NOT NULL,
    email nvarchar(255)  NOT NULL,
    auditExcluded bit  NOT NULL DEFAULT ( 0 ),
    createdAt datetimeoffset(7)  NOT NULL,
    updatedAt datetimeoffset(7)  NOT NULL,
    CONSTRAINT "dbo.Players_pk" PRIMARY KEY CLUSTERED (id)
)
ON PRIMARY;

-- foreign keys
-- Reference: Cards_Games (table: Cards)
ALTER TABLE dbo.Cards ADD CONSTRAINT Cards_Games
    FOREIGN KEY (gameId)
    REFERENCES dbo.Games (id);

-- Reference: Cards_Players (table: Cards)
ALTER TABLE dbo.Cards ADD CONSTRAINT Cards_Players
    FOREIGN KEY (whoOwnerCard)
    REFERENCES dbo.Players (id);

-- Reference: GamePlayers_Games (table: GamePlayers)
ALTER TABLE dbo.GamePlayers ADD CONSTRAINT GamePlayers_Games
    FOREIGN KEY (gameId)
    REFERENCES dbo.Games (id);

-- Reference: GamePlayers_Players (table: GamePlayers)
ALTER TABLE dbo.GamePlayers ADD CONSTRAINT GamePlayers_Players
    FOREIGN KEY (playerId)
    REFERENCES dbo.Players (id);

-- Reference: Player_Games_Players_Creator (table: Games)
ALTER TABLE dbo.Games ADD CONSTRAINT Player_Games_Players_Creator
    FOREIGN KEY (creatorId)
    REFERENCES dbo.Players (id);

-- Reference: Player_Games_Players_Current (table: Games)
ALTER TABLE dbo.Games ADD CONSTRAINT Player_Games_Players_Current
    FOREIGN KEY (currentPlayer)
    REFERENCES dbo.Players (id);

-- End of file.

