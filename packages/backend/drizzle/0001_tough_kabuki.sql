ALTER TABLE "card" DROP CONSTRAINT "card_list_id_list_id_fk";
--> statement-breakpoint
ALTER TABLE "list" DROP CONSTRAINT "list_boardId_board_id_fk";
--> statement-breakpoint
ALTER TABLE "label" DROP CONSTRAINT "label_board_id_board_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_board" DROP CONSTRAINT "user_board_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_board" DROP CONSTRAINT "user_board_boardId_board_id_fk";
--> statement-breakpoint
ALTER TABLE "card_label" DROP CONSTRAINT "card_label_card_id_card_id_fk";
--> statement-breakpoint
ALTER TABLE "card_label" DROP CONSTRAINT "card_label_label_id_label_id_fk";
--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_list_id_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "list_boardId_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_board" ADD CONSTRAINT "user_board_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_board" ADD CONSTRAINT "user_board_boardId_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_label" ADD CONSTRAINT "card_label_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_label" ADD CONSTRAINT "card_label_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;