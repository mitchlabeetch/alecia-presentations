import { components } from "./_generated/api";
import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";
import { DataModel } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { GenericQueryCtx, GenericMutationCtx } from "convex/server";

const prosemirrorSync = new ProsemirrorSync(components.prosemirrorSync);

export const {
  getSnapshot,
  submitSnapshot,
  latestVersion,
  getSteps,
  submitSteps,
} = prosemirrorSync.syncApi<DataModel>({
  checkRead: async (ctx: GenericQueryCtx<DataModel>, _id: string) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
  },
  checkWrite: async (ctx: GenericMutationCtx<DataModel>, _id: string) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non authentifié");
  },
});
