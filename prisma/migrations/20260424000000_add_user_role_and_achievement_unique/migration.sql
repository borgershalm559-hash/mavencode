-- Add role column to User (required by schema)
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';

-- Add unique constraint on Achievement.title
CREATE UNIQUE INDEX "Achievement_title_key" ON "Achievement"("title");
