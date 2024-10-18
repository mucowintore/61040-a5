import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface TranscriptionDoc extends BaseDoc {
    transcribedBy: ObjectId,
    postId: ObjectId,
    transcript: string,
}

/**
 * concept: Transcribing [User, Post]
 */
export default class TranscribingConcept {
    public readonly transcriptions: DocCollection<TranscriptionDoc>

    constructor(collectionName: string) {
        this.transcriptions = new DocCollection<TranscriptionDoc>(collectionName)
    }

    async addTranscription(user: ObjectId, postId: ObjectId, transcript: string) {
        await this.assertUserCanTranscribe(user, postId)
        const _id = await this.transcriptions.createOne({
            transcribedBy: user,
            postId,
            transcript
        })

        return {
            "msg": "Transcription successfully added!",
            transcription: await this.transcriptions.readOne({ _id })
        }
    }

    async getPostTranscriptions(postId: ObjectId) {
        const result = await this.transcriptions.readMany({ postId })
        return {
            transcriptions: result
        }
    }

    async deleteTranscription(userId: ObjectId, transcriptionId: ObjectId) {
        await this.assertTranscriptionExists(transcriptionId)
        await this.assertIsTranscriptionAuthor(userId, transcriptionId)

        const transcription = await this.transcriptions.popOne({_id: transcriptionId})
        return {
            "msg": "Transcription successfully deleted",
            transcription
        }
    }

    async deletePostTranscriptions(postId: ObjectId) {
        const result = this.transcriptions.deleteMany({ postId })
        console.log(JSON.stringify(result, null, 2))
        return result
    }

    

    private async assertUserCanTranscribe(user: ObjectId, postId: ObjectId) {
        const transcription = await this.transcriptions.readOne({explainedBy: user, postId})
        if(transcription) {
            throw new UserAlreadyTranscribedError(user, postId)
        }
    }

    private async assertTranscriptionExists(transcriptionId: ObjectId) {
        const transcription = await this.transcriptions.readOne(transcriptionId)
        if(!transcription) {
            throw new TranscriptionNotFoundError(transcriptionId)
        }
    }
    private async assertIsTranscriptionAuthor(userId: ObjectId, transcriptionId: ObjectId) {
        const transcription = await this.transcriptions.readOne(transcriptionId)
        if(!transcription) {
            throw new TranscriptionNotFoundError(transcriptionId)
        }

        if(transcription.transcribedBy.toString() !== userId.toString()) {
            throw new UserNotTranscriptionAuthorError(userId, transcriptionId)
        }
    }
}

export class UserAlreadyTranscribedError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly postId: ObjectId,
    ) {
        super(`User ${user} has already transcribed post ${postId}`)
    }
}

export class UserNotTranscriptionAuthorError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly transcriptionId: ObjectId,
    ) {
        super(`User ${user} is not the author of transcription ${transcriptionId}`)
    }
}

export class TranscriptionNotFoundError extends NotFoundError {
    constructor(
        public readonly transcriptionId: ObjectId
    ) {
        super(`Transcription ${transcriptionId} does not exist`)
    }
}

