import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ExplanationDoc extends BaseDoc {
    explainedBy: ObjectId,
    postId: ObjectId,
    entry: string,
    definition: string,
    example: string
}

/**
 * concept: Explaining [User, Post]
 */
export default class ExplainingConcept {
    public readonly explanations: DocCollection<ExplanationDoc>

    constructor(collectionName: string) {
        this.explanations = new DocCollection<ExplanationDoc>(collectionName)
    }

    async addExplanation(user: ObjectId, postId: ObjectId, entry: string, definition: string, example: string) {
        await this.assertUserCanExplain(user, postId, entry)
        const _id = await this.explanations.createOne({
            explainedBy: user,
            postId,
            entry,
            definition,
            example
        })

        return {
            "msg": "Explanation successfully added!",
            explanation: await this.explanations.readOne({ _id })
        }
    }

    async getPostExplanations(postId: ObjectId) {
        const result = await this.explanations.readMany({ postId })
        return {
            explanations: result
        }
    }

    async deleteExplanation(userId: ObjectId, explanationId: ObjectId) {
        await this.assertExplanationExists(explanationId)
        await this.assertIsExplanationAuthor(userId, explanationId)

        const explanation = await this.explanations.popOne({_id: explanationId})
        return {
            "msg": "Explanation successfully deleted",
            explanation
        }
    }

    async deletePostExplanations(postId: ObjectId) {
        const result = this.explanations.deleteMany({ postId })
        console.log(JSON.stringify(result, null, 2))
        return result
    }

    

    private async assertUserCanExplain(user: ObjectId, postId: ObjectId, entry: string) {
        const explanation = await this.explanations.readOne({explainedBy: user, postId, entry})
        if(explanation) {
            throw new UserAlreadyExplainedError(user, postId, entry)
        }
    }

    private async assertExplanationExists(explanationId: ObjectId) {
        const explanation = await this.explanations.readOne( {_id: explanationId })
        if(!explanation) {
            throw new ExplanationNotFoundError(explanationId)
        }
    }
    private async assertIsExplanationAuthor(userId: ObjectId, explanationId: ObjectId) {
        const explanation = await this.explanations.readOne(explanationId)
        if(!explanation) {
            throw new ExplanationNotFoundError(explanationId)
        }

        if(explanation.explainedBy.toString() !== userId.toString()) {
            throw new UserNotExplanationAuthorError(userId, explanationId)
        }
    }
}

export class UserAlreadyExplainedError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly postId: ObjectId,
        public readonly entry: string
    ) {
        super(`User ${user} has already provided an explanation for the entry ${entry} in post ${postId}`)
    }
}

export class UserNotExplanationAuthorError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly explanationId: ObjectId,
    ) {
        super(`User ${user} is not the author of explanation ${explanationId}`)
    }
}

export class ExplanationNotFoundError extends NotFoundError {
    constructor(
        public readonly explanationId: ObjectId
    ) {
        super(`Explanation ${explanationId} does not exist`)
    }
}

