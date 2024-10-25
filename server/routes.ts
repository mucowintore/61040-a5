import { ObjectId } from "mongodb";

import { getExpressRouter, Router } from "./framework/router";

import { Authing, Explaining, Posting, Recording, Sessioning, Transcribing, Translating, Upvoting } from "./app";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.get("/users/userId/:userId")
  @Router.validate(z.object({ userId: z.string().min(1) }))
  async getUserById(userId: string) {
    return await Authing.getUserById(new ObjectId(userId));
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.get("/posts/:id")
  async getPost(id: string) {
    return await Posting.getPost(new ObjectId(id))
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, title: string, mediaType: string, thumbnailUrl: string, content: string) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, title, mediaType, thumbnailUrl, content);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const postId = new ObjectId(id);
    await Posting.assertAuthorIsUser(postId, user);
    await Translating.deletePostTranslations(postId)
    await Transcribing.deletePostTranscriptions(postId)
    await Recording.deletePostRecordings(postId)
    await Explaining.deletePostExplanations(postId)
    await Upvoting.deleteItemUpvotes(postId)
    return Posting.delete(postId);
  }  

  @Router.get("/posts/:postId/translations")
  async getPostTranslations(postId: string) {
    return await Translating.getPostTranslations(new ObjectId(postId))
  }


  @Router.put("/posts/:postId/translation")
  async addTranslation(session: SessionDoc, postId: string, targetLanguage: string, translatedString: string) {
    const user = Sessioning.getUser(session)
    return await Translating.addTranslation(
      user,
      new ObjectId(postId),
      targetLanguage,
      translatedString)
  }

  @Router.delete("/translations/:translationId")
  async deleteTranslation(session: SessionDoc, translationId: string) {
    const userId = Sessioning.getUser(session)
    return await Translating.deleteTranslation(userId, new ObjectId(translationId))
  }

  @Router.get("/posts/:postId/transcriptions")
  async getPostTranscriptions(postId: string){
    return await Transcribing.getPostTranscriptions(new ObjectId(postId))
  }

  @Router.put("/posts/:postId/transcription")
  async addTranscription(session: SessionDoc, postId: string, transcript: string){
    const user = Sessioning.getUser(session)
    const postOid = new ObjectId(postId)
    await Posting.assertIsListenable(postOid)
    return await Transcribing.addTranscription(user, postOid, transcript)
  }

  @Router.delete("/transcriptions/:transcriptionId")
  async deleteTranscription(session: SessionDoc, transcriptionId: string){
    const userOid = Sessioning.getUser(session)
    return await Transcribing.deleteTranscription(userOid, new ObjectId(transcriptionId))
  }

  @Router.get("/posts/:postId/recordings")
  async getPostRecordings(postId: string){
    return await Recording.getPostRecordings(new ObjectId(postId))
  }

  @Router.put("/posts/:postId/recording")
  async addRecording(session: SessionDoc, postId: string, audioUrl: string){
    const userOid = Sessioning.getUser(session)
    const postOid = new ObjectId(postId)
    await Posting.assertIsReadable(postOid)
    return await Recording.addRecording(userOid, postOid, audioUrl)
  }

  @Router.delete("/recordings/:recordingId")
  async deleteRecording(session: SessionDoc, recordingId: string){
    const userOid = Sessioning.getUser(session)
    return await Recording.deleteRecording(userOid, new ObjectId(recordingId))
  }

  @Router.get("/posts/:postId/explanations")
  async getPostExplanations(postId: string){
    return await Explaining.getPostExplanations(new ObjectId(postId))
  }

  @Router.put("/posts/:postId/explanation")
  async addExplanation(session: SessionDoc, postId: string, entry: string, definition: string, example: string){
    const userOid = Sessioning.getUser(session)
    const postOid = new ObjectId(postId)
    return await Explaining.addExplanation(userOid, postOid, entry, definition, example)
  }

  @Router.delete("/explanations/:explanationId")
  async deleteExplanation(session: SessionDoc, explanationId: string){
    const userOid = Sessioning.getUser(session)
    return await Explaining.deleteExplanation(userOid, new ObjectId(explanationId))
  }

  
  @Router.put("/upvote/:contentId")
  async upvoteContent(session: SessionDoc, contentId: string) {
    const user = Sessioning.getUser(session)
    return await Upvoting.upvoteContent(user, new ObjectId(contentId))
  }

  @Router.get("/upvotes/:contentId")
  async getUpvotes(contentId: string) {
    return await Upvoting.getUpvotes(new ObjectId(contentId))
  }

  @Router.delete("/upvote/:contentId")
  async removeUpvote(session: SessionDoc, contentId: string) {
    const user = Sessioning.getUser(session)
    return await Upvoting.deleteUpvote(user, new ObjectId(contentId))
  }

}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
