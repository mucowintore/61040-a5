import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface RecordingDoc extends BaseDoc {
    recordedBy: ObjectId,
    postId: ObjectId,
    audioUrl: string,
}

/**
 * concept: Recording [User, Post]
 */
export default class RecordingConcept {
    public readonly recordings: DocCollection<RecordingDoc>

    constructor(collectionName: string) {
        this.recordings = new DocCollection<RecordingDoc>(collectionName)
    }

    async addRecording(user: ObjectId, postId: ObjectId, audioUrl: string) {
        await this.assertCanRecord(user, postId)
        const _id = await this.recordings.createOne({
            recordedBy: user,
            postId,
            audioUrl
        })

        return {
            "msg": "Recording successfully added!",
            recording: await this.recordings.readOne({ _id })
        }
    }

    async getPostRecordings(postId: ObjectId) {
        const result = await this.recordings.readMany({ postId })
        return {
            recordings: result
        }
    }

    async deleteRecording(userId: ObjectId, recordingId: ObjectId) {
        await this.assertRecordingExists(recordingId)
        await this.assertIsRecordingAuthor(userId, recordingId)

        const recording = await this.recordings.popOne({_id: recordingId})
        return {
            "msg": "Recording successfully deleted",
            recording
        }
    }

    async deletePostRecordings(postId: ObjectId) {
        return await this.recordings.deleteMany({ postId })
    }

    

    private async assertCanRecord(user: ObjectId, postId: ObjectId) {
        const recording = await this.recordings.readOne({recordedBy: user, postId})
        if(recording) {
            throw new UserAlreadyRecordedError(user, postId)
        }
    }

    private async assertRecordingExists(recordingId: ObjectId) {
        const recording = await this.recordings.readOne(recordingId)
        if(!recording) {
            throw new RecordingNotFoundError(recordingId)
        }
    }
    private async assertIsRecordingAuthor(userId: ObjectId, recordingId: ObjectId) {
        const recording = await this.recordings.readOne(recordingId)
        if(!recording) {
            throw new RecordingNotFoundError(recordingId)
        }
        
        if(recording.recordedBy.toString() !== userId.toString()) {
            throw new UserNotRecordingAuthorError(userId, recordingId)
        }
    }
}

export class UserAlreadyRecordedError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly postId: ObjectId,
    ) {
        super(`User ${user} has already recorded post ${postId}`)
    }
}

export class UserNotRecordingAuthorError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
        public readonly recordingId: ObjectId,
    ) {
        super(`User ${user} is not the author of recording ${recordingId}`)
    }
}

export class RecordingNotFoundError extends NotFoundError {
    constructor(
        public readonly recordingId: ObjectId
    ) {
        super(`Recording ${recordingId} does not exist`)
    }
}

