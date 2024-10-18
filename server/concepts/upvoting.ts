import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface UpvoteDoc extends BaseDoc {
    user: ObjectId,
    content: ObjectId
}
/**
 * concept: Upvoting [User, Content]
 */
export default class UpvotingConcept {
    public readonly upvotes: DocCollection<UpvoteDoc>

    constructor(collectionName: string) {
        this.upvotes = new DocCollection<UpvoteDoc>(collectionName)
    }

    async upvoteContent(user: ObjectId, content: ObjectId) {
        await this.canUpvote(user, content)
        const _id = await this.upvotes.createOne({ user, content })
        return { msg: "Upvote successfully added!", upvote: await this.upvotes.readOne({ _id })}
    }

    async deleteUpvote(user: ObjectId, content: ObjectId) {
        const upvote = await this.upvotes.popOne({user, content})
        if(upvote === null) {
            throw new UpvoteNotFoundError(user, content)
        }

        return {
            "msg": "Upvote successfully deleted",
            upvote
        }
    }

    async deleteItemUpvotes(itemId: ObjectId) {
        await this.upvotes.deleteMany({ content: itemId })
    }

    async getUpvotes(content: ObjectId) {
        const result = await this.upvotes.readMany({content})
        return {
            upvotes: result
        }
    }

    private async canUpvote(user: ObjectId, content: ObjectId) {
        const upvote = await this.upvotes.readOne({user, content})
        if(upvote) {
            throw new UserAlreadyUpvotedError(user, content)
        }
    }
}

export class UserAlreadyUpvotedError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly content: ObjectId
    ) {
        super(`User ${user} has already upvoted content ${content}`)
    }
}

export class UpvoteNotFoundError extends NotFoundError {
    constructor(
      public readonly user: ObjectId,
      public readonly content: ObjectId,
    ) {
      super(`No upvote of content ${content} by user ${user} was found`);
    }
  }
