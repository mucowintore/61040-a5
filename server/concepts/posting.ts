import { ObjectId } from "mongodb"

import DocCollection, { BaseDoc } from "../framework/doc"
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors"

export interface PostDoc extends BaseDoc {
  author: ObjectId
  title: string
  thumbnailUrl: string
  mediaType: string
  content: string
}

export const SUPPORTED_MEDIA_TYPES = ['text', 'audio', 'video']

/**
 * concept: Posting [Author]
 */
export default class PostingConcept {
  public readonly posts: DocCollection<PostDoc>

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.posts = new DocCollection<PostDoc>(collectionName)
  }

  async create(author: ObjectId, title: string, mediaType: string, thumbnailUrl: string, content: string) {
    await this.assertMediaTypeIsValid(mediaType)
    const _id = await this.posts.createOne({ author, title, mediaType, thumbnailUrl , content })
    return { msg: "Post successfully created!", post: await this.posts.readOne({ _id }) }
  }

  async getPosts() {
    // Returns all posts! You might want to page for better client performance
    return await this.posts.readMany({}, { sort: { _id: -1 } })
  }

  async getPost(_id: ObjectId) {
    const post = await this.posts.readOne({ _id})
    if(!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`)
    }
    return post
  }

  async getByAuthor(author: ObjectId) {
    return await this.posts.readMany({ author })
  }

  async delete(_id: ObjectId) {
    await this.posts.deleteOne({ _id })
    return { msg: "Post deleted successfully!" }
  }

  async assertExists(postId: ObjectId) {
    const post = await this.posts.readOne({ _id: postId })
    if(!post) {
      throw new NotFoundError(`Post ${postId} does not exist!`)
    }
  }
  
  async assertIsReadable(postId: ObjectId) {
    const post = await this.posts.readOne({ _id: postId })
    if(!post) {
      throw new NotFoundError(`Post ${postId} does not exist!`)
    }

    if(post.mediaType !== 'text') {
      throw new PostNotReadableError(postId)
    }
  }

  async assertIsListenable(postId: ObjectId) {
    const post = await this.posts.readOne({ _id: postId })
    if(!post) {
      throw new NotFoundError(`Post ${postId} does not exist!`)
    }

    if(post.mediaType !== 'audio' && post.mediaType !== 'video') {
      throw new PostNotListenableError(postId)
    }
  }

  async assertMediaTypeIsValid(mediaType: string) {
    if (!SUPPORTED_MEDIA_TYPES.includes(mediaType)) {
      throw new InvalidMediaTypeError()
    }
  }
  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const post = await this.posts.readOne({ _id })
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`)
    }
    if (post.author.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, _id)
    }
  }
}

export class InvalidMediaTypeError extends BadValuesError {
  constructor() {
    super("The mediaType parameter provided is invalid. Supported media types are: 'text', 'audio' or 'video'")
  }
}

export class PostNotListenableError extends NotAllowedError {
  constructor(
    public readonly post: ObjectId
  ) {
    super(`Post ${post} does not have audio content`)
  }
}

export class PostNotReadableError extends NotAllowedError {
  constructor(
    public readonly post: ObjectId
  ) {
    super(`Post ${post} does not have text content`)
  }
}


export class PostAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id)
  }
}

export class PostNotFoundError extends NotFoundError {
  constructor(
    public readonly post: ObjectId,
  ) {
    super(`Post ${post} does not exist`);
  }
}
