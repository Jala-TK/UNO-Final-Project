-- Last modification date: 2024-07-23 02:00:50.87

-- tables
-- Table: Cards
CREATE TABLE Cards
(
    id int NOT NULL,
    color nvarchar(255) NOT NULL,
    value int NOT NULL,
    gameId int NOT NULL,
    whoOwnerCard int NULL,
    discarded bit NOT NULL,
    auditExcluded bit NOT NULL,
    CONSTRAINT Cards_pk PRIMARY KEY  (id)
);

-- Table: GamePlayers
CREATE TABLE GamePlayers
(
    id int NOT NULL,
    playerId int NOT NULL,
    gameId int NOT NULL,
    status bit NOT NULL,
    score int NOT NULL,
    auditExcluded bit NOT NULL,
    CONSTRAINT GamePlayers_pk PRIMARY KEY  (id)
);

-- Table: Games
CREATE TABLE Games
(
    id int NOT NULL,
    title nvarchar(255) NOT NULL,
    status nvarchar(255) NOT NULL,
    maxPlayers int NOT NULL,
    currentPlayer int NULL,
    Players_id int NULL,
    auditExcluded bit NOT NULL,
    CONSTRAINT Games_pk PRIMARY KEY  (id)
);

-- Table: Players
CREATE TABLE Players
(
    id int NOT NULL,
    username nvarchar(255) NOT NULL,
    password nvarchar(255) NOT NULL,
    email nvarchar(255) NOT NULL,
    auditExcluded bit NOT NULL,
    CONSTRAINT Players_pk PRIMARY KEY  (id)
);

-- foreign keys
-- Reference: Cards_Games (table: Cards)
ALTER TABLE Cards ADD CONSTRAINT Cards_Games
    FOREIGN KEY (gameId)
    REFERENCES Games (id);

-- Reference: Cards_Players (table: Cards)
ALTER TABLE Cards ADD CONSTRAINT Cards_Players
    FOREIGN KEY (whoOwnerCard)
    REFERENCES Players (id);

-- Reference: Games_Players (table: Games)
ALTER TABLE Games ADD CONSTRAINT Games_Players
    FOREIGN KEY (Players_id)
    REFERENCES Players (id);

-- Reference: Games_Users_Games (table: GamePlayers)
ALTER TABLE GamePlayers ADD CONSTRAINT Games_Users_Games
    FOREIGN KEY (gameId)
    REFERENCES Games (id);

-- Reference: Games_Users_Users (table: GamePlayers)
ALTER TABLE GamePlayers ADD CONSTRAINT Games_Users_Users
    FOREIGN KEY (playerId)
    REFERENCES Players (id);

-- End of file.

