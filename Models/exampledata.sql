
TRUNCATE TABLE "Bicycles", "Users", "Reviews" RESTART IDENTITY;
-- INSERT INTO "Users" ( "FullName", "Email", "HashedPassword") VALUES ( 'John Doe', 'sample1@gmail.com', 'Password1');
-- INSERT INTO "Users" ( "FullName", "Email", "HashedPassword") VALUES ( 'Jane Doe', 'sample2@gmail.com', 'Password2');
-- INSERT INTO "Users" ( "FullName", "Email", "HashedPassword") VALUES ( 'John Smith', 'sample3@gmail.com', 'passwords');

INSERT INTO "Bicycles" ("UserId", "Title", "Description", "Frame", "Fork", "Saddle", "Handlebar", "BottomBracket", "ChainRing", "RearCog", "Crank", "WheelSet", "Pedals", "Other") VALUES (1, 'Bicycle 1e', 'Description a 1', 'Frame 1', 'Fork 1', 'Saddle 1', 'Handlebar 1', 'BottomBracket 1', 'ChainRing 1', 'RearCog 1', 'Crank 1', 'WheelSet 1', 'Pedals 1', 'Other 1');
INSERT INTO "Bicycles" ("UserId", "Title", "Description", "Frame", "Fork", "Saddle", "Handlebar", "BottomBracket", "ChainRing", "RearCog", "Crank", "WheelSet", "Pedals", "Other") VALUES (1, 'Bicycle 2f', 'Description b 2', 'Frame 2', 'Fork 2', 'Saddle 2', 'Handlebar 2', 'BottomBracket 2', 'ChainRing 2', 'RearCog 2', 'Crank 2', 'WheelSet 2', 'Pedals 2', 'Other 2');
INSERT INTO "Bicycles" ("UserId", "Title", "Description", "Frame", "Fork", "Saddle", "Handlebar", "BottomBracket", "ChainRing", "RearCog", "Crank", "WheelSet", "Pedals", "Other") VALUES (1, 'Bicycle 3g', 'Description c 3', 'Frame 3', 'Fork 3', 'Saddle 3', 'Handlebar 3', 'BottomBracket 3', 'ChainRing 3', 'RearCog 3', 'Crank 3', 'WheelSet 3', 'Pedals 3', 'Other 3');
INSERT INTO "Bicycles" ("UserId", "Title", "Description", "Frame", "Fork", "Saddle", "Handlebar", "BottomBracket", "ChainRing", "RearCog", "Crank", "WheelSet", "Pedals", "Other") VALUES (1, 'Bicycle 4h', 'Description d 4', 'Frame 4', 'Fork 4', 'Saddle 4', 'Handlebar 4', 'BottomBracket 4', 'ChainRing 4', 'RearCog 4', 'Crank 4', 'WheelSet 4', 'Pedals 4', 'Other 4');


INSERT INTO "Reviews" ("UserId", "BicycleId", "CreatedAt", "Summary", "Body", "Stars") VALUES (1, 1, '2020-01-01 14:23:55', 'Clean', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima modi impedit quisquam sit, saepe enim placeat a vero voluptas asperiores atque laudantium in, nobis sunt blanditiis dignissimos. Deleniti, esse optio!', 4);
INSERT INTO "Reviews" ("UserId", "BicycleId", "CreatedAt", "Summary", "Body", "Stars") VALUES (1, 2, '2020-01-01 12:23:55', 'Super Clean', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima modi impedit quisquam sit, saepe enim placeat a vero voluptas asperiores atque laudantium in, nobis sunt blanditiis dignissimos. Deleniti, esse optio!', 4);
INSERT INTO "Reviews" ("UserId", "BicycleId", "CreatedAt", "Summary", "Body", "Stars") VALUES (1, 3, '2020-01-01 10:23:55', 'Super Super Clean', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima modi impedit quisquam sit, saepe enim placeat a vero voluptas asperiores atque laudantium in, nobis sunt blanditiis dignissimos. Deleniti, esse optio!', 4);

-- INSERT INTO "Users" ("Id", "FullName", "Email", "HashedPassword") VALUES (1, 'John Doe', 'sample1@gmail.com', 'Password1');