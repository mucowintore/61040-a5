import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface TranslationDoc extends BaseDoc {
    translatedBy: ObjectId,
    postId: ObjectId,
    translatedString: string,
    targetLanguage: string
}

/**
 * concept: Translating [User, Post]
 */
export default class TranslatingConcept {
    public readonly translations: DocCollection<TranslationDoc>

    constructor(collectionName: string) {
        this.translations = new DocCollection<TranslationDoc>(collectionName)
    }

    async addTranslation(user: ObjectId, postId: ObjectId, targetLanguage: string, translatedString: string) {
        await this.assertUserCanTranslate(user, postId, targetLanguage)
        const _id = await this.translations.createOne({
            translatedBy: user,
            translatedString,
            targetLanguage,
            postId,
        })

        return {
            "msg": "Translation successfully added!",
            translation: await this.translations.readOne({ _id })
        }
    }

    async getPostTranslations(postId: ObjectId) {
        const result = await this.translations.readMany({ postId })
        return {
            translations: result
        }
    }

    async deleteTranslation(userId: ObjectId, translationId: ObjectId) {
        await this.translationExists(translationId)
        await this.assertIsTranslationAuthor(userId, translationId)

        const translation = await this.translations.popOne({_id: translationId})
        return {
            "msg": "Translation successfully deleted",
            translation
        }
    }

    async deletePostTranslations(postId: ObjectId) {
        const result = this.translations.deleteMany({ postId })
        console.log(JSON.stringify(result, null, 2))
        return result
    }

    

    private async assertUserCanTranslate(user: ObjectId, postId: ObjectId, targetLanguage: string) {
        const translation = await this.translations.readOne({
            $and: [
                { translatedBy: user },
                { postId }, 
                {targetLanguage }
            ]
        })

        if(translation) {
            throw new UserAlreadyTranslatedError(user, postId, targetLanguage)
        }
    }

    private async translationExists(translationId: ObjectId) {
        const translation = await this.translations.readOne(translationId)
        if(!translation) {
            throw new TranslationNotFoundError(translationId)
        }
    }
    private async assertIsTranslationAuthor(userId: ObjectId, translationId: ObjectId) {
        const translation = await this.translations.readOne(translationId)
        if(!translation) {
            throw new TranslationNotFoundError(translationId)
        }
        
        if(translation.translatedBy.toString() !== userId.toString()) {
            throw new UserNotTranslationAuthorError(userId, translationId)
        }
    }
}

export class UserAlreadyTranslatedError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly postId: ObjectId,
        public readonly targetLanguage: string,
    ) {
        super(`User ${user} has already translated post ${postId} in ${targetLanguage}`)
    }
}

export class UserNotTranslationAuthorError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly translationId: ObjectId,
    ) {
        super(`User ${user} is not the author of translation ${translationId}`)
    }
}

export class TranslationNotFoundError extends NotFoundError {
    constructor(
        public readonly translationId: ObjectId
    ) {
        super(`Translation ${translationId} does not exist`)
    }
}

