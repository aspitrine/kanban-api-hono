CREATE TYPE "public"."status" AS ENUM('active', 'suspended', 'pending');--> statement-breakpoint
ALTER TABLE "user_board" ADD COLUMN "status" "status" DEFAULT 'pending';